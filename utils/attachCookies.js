const jwt = require('jsonwebtoken')
const asyncWrapper = require('./asyncWrapper')
const { UnAuthorizedError} = require("../errors");

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,)
}
const attachCookies = ({res, payload, expires}) => {
    const token = createToken(payload)
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + expires)
    })
}

const getCookies = asyncWrapper(async (req, res, next) => {
    const {accessToken} = req?.signedCookies
    console.log(accessToken)
    if(!accessToken) {
        throw new UnAuthorizedError("Not authorized to access this resource")
    }
    else {
        req.user = await jwt.verify(accessToken, process.env.JWT_SECRET)
        next()
    }
})

module.exports = {attachCookies, getCookies}