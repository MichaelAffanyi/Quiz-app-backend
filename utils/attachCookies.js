const jwt = require('jsonwebtoken')
const asyncWrapper = require('./asyncWrapper')
const { UnAuthorizedError} = require("../errors");

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,)
}
const attachCookies = ({res, payload, expires}) => {
    const token = createToken(payload)
    res.cookie('accessToken', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + expires)
    })
}

const getCookies = asyncWrapper(async (req, res, next) => {
    const authToken = req.headers.authorization
    if(!authToken || !authToken.startsWith('Bearer')) {
        throw new UnAuthorizedError("Not authorized to access this resource")
    }
    const token = authToken.split(' ')[1]
    req.user = await jwt.verify(token, process.env.JWT_SECRET)
    next()
    // const {accessToken} = req?.signedCookies
    // if(!accessToken) {
    //     throw new UnAuthorizedError("Not authorized to access this resource")
    // }
    // else {
    //     req.user = await jwt.verify(accessToken, process.env.JWT_SECRET)
    //     next()
    // }
})

module.exports = {attachCookies, getCookies}