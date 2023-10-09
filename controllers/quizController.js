const asyncWrapper = require('../utils/asyncWrapper')

exports.addQuiz = asyncWrapper(async (req, res, next) => {
    res.send('add quiz')
})
exports.getAllQuizzes = asyncWrapper(async (req, res, next) => {
    res.send('get all quizzes')
})