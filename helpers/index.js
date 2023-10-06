const bcrypt = require('bcrypt')

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

// exports.comparePasswords = async (password, hash) => {
//     console.log(password, hash)
//     return await bcrypt.compare(password, hash)
// }