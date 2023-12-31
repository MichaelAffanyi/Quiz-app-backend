const {UnAuthorizedError} = require("../errors");

const grantAccess = (req, res, next) => {
    const {role} = req.user
    if(role !== 'admin' && role !== 'lecturer') {
        throw new UnAuthorizedError("Not authorized to access this resource")
    }
    else {
        next()
    }
}

module.exports = grantAccess