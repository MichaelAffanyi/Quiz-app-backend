const User = require('../models/User')
const { attachCookies, sendEmail} = require("../utils");
const asyncWrapper = require('../utils/asyncWrapper')
const {BadRequestError, NotFoundError, UnAuthorizedError} = require('../errors')
const crypto = require('crypto')
const {StatusCodes} = require("http-status-codes");
const fs = require("fs");
const {hashPassword} = require("../helpers");
const cloudinary = require('cloudinary').v2

exports.registerUser = asyncWrapper(
    async (req, res) => {
        let role = 'user'
        const {name, email, password} = req.body
        if(!name || !email || !password) {
            throw new BadRequestError('Name, email or password cannot be empty')
        }
        const hashedPassword = await hashPassword(password)
        const users = await User.countDocuments()
        console.log(users)
        if (users < 1) {
            role = 'admin'
        }
        const userDoc = await User.create({name, email, password: hashedPassword, role})

        const expires = 1000 * 60 * 60 * 24
        const user = {
            id: userDoc._id,
            role: userDoc.role
            // name: userDoc.name,
            // email: userDoc.email
        }
        attachCookies({res, payload: user, expires})
        res.status(200).json({msg: 'User Registered successfully'})
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
            role: user.role
            // name: user.name,
            // email: user.email
        }
        attachCookies({res, payload: jwtUser, expires: tokenLifetime})
        res.status(200).json({msg: 'login successful'})
    }
)

exports.logoutUser = asyncWrapper(async (req, res) => {
    res.clearCookie('accessToken')
    res.status(StatusCodes.OK).json({msg: 'User logged out successfully'})
})

exports.showMe = asyncWrapper(async (req, res) => {
    const {id} = req.user
    const user = await User.findById(id).select(['-password', '-purpose', '-interest', '-passwordToken', '-cloudinaryId'])
    if(!user) {
        throw new NotFoundError("No user found")
    }
    res.status(StatusCodes.OK).json({user})
})

exports.forgotPassword = asyncWrapper(async (req, res) => {
    const {email} = req.body
    if(!email) {
        throw new BadRequestError('Please provide email')
    }

    const user = await User.findOne({email})
    // console.log(user)

    if(user) {
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
                        <a href="http://localhost:4000/reset-password/${randomToken}">Password reset</a>
                    </div>
                   `
        }
        await sendEmail(emailTemplate)
        user.save()
    }
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
        throw new BadRequestError('Unauthorized to access this resource')
    }

    if(user.passwordTokenLifetime < new Date(Date.now())) {
        throw new BadRequestError('Reset Link expired Please try again')
    }
    user.password = await hashPassword(newPassword)
    user.passwordTokenLifetime = null
    user.passwordToken = ''
    user.save()
    res.status(StatusCodes.OK).json({msg: 'Password reset successfully'})
})

exports.uploadProfile = asyncWrapper(async (req, res) => {
    const file = req.files
    const {id} = req.user
    if (!file) {
        throw new BadRequestError('Please provide an image')
    }

    if (!file.image.mimetype.includes('image')) {
        throw new BadRequestError('File should be an image')
    }

    const user = await User.findById(id)
    if (!user) {
        throw new UnAuthorizedError("Cannot set profile image")
    }

    const result = await cloudinary.uploader.upload(file.image.tempFilePath, {
        public_id: user.cloudinaryId,
        folder: 'quiz app',
        use_filename: true,
        overwrite: true
    })
    const publicId = result.public_id.split('/')[1]
    fs.unlinkSync(file.image.tempFilePath)

    user.profilePhoto = result.secure_url
    user.cloudinaryId = publicId
    await user.save()

    res.status(StatusCodes.OK).json({image: result.secure_url})
})

exports.addInterest = asyncWrapper(async (req, res) => {
    const {interests} = req.body
    const {id} = req.user
    if(!interests) {
        throw new BadRequestError('Please provide interests')
    }
    if (!Array.isArray(interests)) {
        throw new BadRequestError('Invalid format for interests')
    }

    const user = await User.findById(id)
    if (!user) {
        throw new UnAuthorizedError('Cannot add interests')
    }
    user.interest = interests
    await user.save()
    res.status(StatusCodes.OK).json({msg: 'Interests added'})
})
exports.addPurpose = asyncWrapper(async (req, res) => {
    const {purpose} = req.body
    const {id} = req.user
    if(!purpose) {
        throw new BadRequestError('Please provide credentials')
    }
    if (!Array.isArray(purpose)) {
        throw new BadRequestError('Invalid format for purpose')
    }

    const user = await User.findById(id)
    if (!user) {
        throw new UnAuthorizedError('Cannot add purpose')
    }
    user.purpose = purpose
    await user.save()
    res.status(StatusCodes.OK).json({msg: 'Purpose added'})
})
