const jwt = require('jsonwebtoken')

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,)
}
const attachCookies = ({res, payload, expires}) => {
    const token = createToken(payload)
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.JWT_SECRET,
        sign: true,
        expires: new Date(Date.now() + expires)
    })
}

module.exports = attachCookies