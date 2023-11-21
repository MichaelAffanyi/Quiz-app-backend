const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

exports.createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET,)
}

// exports.comparePasswords = async (password, hash) => {
//     console.log(password, hash)
//     return await bcrypt.compare(password, hash)
// }