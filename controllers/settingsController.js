const asyncWrapper = require('../utils/asyncWrapper')
const {BadRequestError, NotFoundError} = require("../errors");
const User = require('../models/User')
const {StatusCodes} = require("http-status-codes");
const {hashPassword} = require("../helpers");
const cloudinary = require('cloudinary').v2

exports.generalSettings = asyncWrapper(async (req, res, next) => {
    const {name, email} = req.body
    const {id} = req.user
    // console.log(user)
    if(!name || !email) {
        throw new BadRequestError('Please provide name and email')
    }

    const user = await User.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}).select(['-password', '-passwordToken', '-interest', '-cloudinaryId', '-purpose'])
    // console.log(user)
    res.status(StatusCodes.OK).json(user)
})

exports.changePassword = asyncWrapper(async (req, res, next) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    const {id} = req.user

    if(!oldPassword || !newPassword || !confirmPassword) {
        throw new BadRequestError('Please provide values for old and new passwords')
    }

    const user = await User.findById(id)
    if(!user) {
        throw new NotFoundError('Cannot change password')
    }
    const isPassCorrect = await user.comparePassword(oldPassword)

    if(!isPassCorrect) {
        throw new BadRequestError('Old password incorrect')
    }

    if(newPassword !== confirmPassword) {
        throw new BadRequestError('New passwords do not match')
    }
    user.password = await hashPassword(newPassword)
    user.save()
    res.status(StatusCodes.OK).json({msg: "Password updated successfully"})
})

exports.deleteAccount = asyncWrapper(async (req, res, next) => {
    const {id} = req.user
    const user = await User.findById(id)
    if(!user) {
        throw new NotFoundError("Can't delete user now, try again later.")
    }
    const public_id = user.cloudinaryId
    console.log(public_id)
    const response = await cloudinary.uploader.destroy(`quiz app/${public_id}`)
    console.log(response)
    await user.remove()
    res.status(StatusCodes.OK).json({msg: 'User deleted successfully'})
})