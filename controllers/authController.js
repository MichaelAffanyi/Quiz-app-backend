const User = require('../models/User')
const { attachCookies, sendEmail} = require("../utils");
const asyncWrapper = require('../utils/asyncWrapper')
const {BadRequestError, NotFoundError} = require('../errors')
const crypto = require('crypto')
const {StatusCodes} = require("http-status-codes");

exports.registerUser = asyncWrapper(
    async (req, res) => {
        const {name, email, password} = req.body
        if(!name || !email || !password) {
            throw new BadRequestError('Name, email or password cannot be empty')
        }
        const userDoc = await User.create({name, email, password})

        const user = {
            id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email
        }

        res.status(200).json({msg: 'User Registered successfully', user})
    }
)

exports.loginUser = asyncWrapper(
    async (req, res) => {
        const {email, password, rememberMe} = req.body
        let tokenLifetime = 1000 * 60 * 60 * 24
        if(!email || !password) {
            throw new BadRequestError('Please provide email and password')
        }

        const user = await User.findOne({email})
        if(!user) {
            throw new NotFoundError('Invalid credentials')
        }
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            throw new BadRequestError('Invalid credentials')
        }
        if(rememberMe) {
            tokenLifetime = 1000 * 60 * 60 * 24 * 30
        }
        const jwtUser = {
            id: user._id,
            name: user.name,
            email: user.email
        }
        attachCookies({res, payload: jwtUser, expires: tokenLifetime})
        res.status(200).json({msg: 'login successful', user: jwtUser})
    }
)

exports.forgotPassword = asyncWrapper(async (req, res) => {
    const {email} = req.body
    if(!email) {
        throw new BadRequestError('Please provide email')
    }

    const user = await User.findOne({email})

    if(email) {
        const randomToken = crypto.randomBytes(40).toString('hex')
        const passwordToken = crypto.createHash('md5').update(randomToken).digest('hex')
        const passwordTokenLifetime = new Date(Date.now() + (1000 * 60 * 10))
        user.passwordToken = passwordToken
        user.passwordTokenLifetime = passwordTokenLifetime

        const emailTemplate = {
            to: email,
            subject: 'Password Reset',
            html: `
<div class="container">
    <h1>Please click on the link below to reset your password</h1>
    <a href="http://localhost/4000/reset-password/${randomToken}">Password reset</a>
</div>
`
        }
        await sendEmail(emailTemplate)
        console.log({passwordToken, passwordTokenLifetime})
    }
    user.save()
    res.status(200).json({msg: 'Reset link sent. Please check your email'})
})

exports.resetPassword = asyncWrapper(async (req, res) => {
    const {newPassword, confirmPassword, token} = req.body
    if(newPassword !== confirmPassword) {
        throw new BadRequestError('Passwords do not match')
    }
    const passwordToken = crypto.createHash('md5').update(token).digest('hex')
    const user = await User.findOne({passwordToken})

    if(!user) {
        throw new BadRequestError('Cannot reset password now')
    }

    if(user.passwordTokenLifetime < new Date(Date.now())) {
        throw new BadRequestError('Reset Link expired Please try again')
    }
    user.password = newPassword
    user.passwordTokenLifetime = null
    user.passwordToken = ''
    user.save()
    res.status(StatusCodes.OK).json({msg: 'Password reset successfully'})
})
