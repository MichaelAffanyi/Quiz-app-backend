const BadRequestError = require('./badRequest')
const UnAuthorizedError = require('./unAuthorized')
const UnAuthenticated = require('./unAuthenticated')
const NotFoundError = require('./notFound')

module.exports = {
    BadRequestError,
    UnAuthenticated,
    UnAuthorizedError,
    NotFoundError
}