const auth = require('./auth')
const settings = require('./settings')
const quizRouter = require('./quizRouter')

module.exports = {
    authRouter: auth,
    settingsRouter: settings,
    quizRouter
}