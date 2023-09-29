const CustomError = require('../errors/CustomError')
const {StatusCodes} = require('http-status-codes')
const errorHandler = (err, req, res, next) => {
    // console.log(err)
    let customError = {
        status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong'
    }
    if(err.name === 'ValidationError') {
        customError.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        customError.status = 400
    }
    if(err.code && err.code === 11000) {
        if(Object.keys(err.keyValue).includes('email')) {
            customError.message = "User already exist with that email"
        } else {
            customError.message = `Duplicated value entered for ${Object.keys(err.keyValue)}`
        }
        customError.status = 400
    }
    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    return res.status(customError.status).json({error: customError.message})
}

module.exports = errorHandler