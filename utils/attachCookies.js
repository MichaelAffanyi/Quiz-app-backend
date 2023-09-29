const jwt = require('jsonwebtoken')

const createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,)
}
const attachCookies = ({res, payload, expires}) => {
    const token = createToken(payload)
    res.cookie('accessToken', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sign: true,
        expires: new Date(Date.now() + expires)
    })
}

module.exports = attachCookies