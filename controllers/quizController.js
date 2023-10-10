const asyncWrapper = require('../utils/asyncWrapper')
const Quiz = require('../models/Quiz')
const {StatusCodes} = require("http-status-codes");

exports.addQuiz = asyncWrapper(async (req, res, next) => {

    const quizDoc = await Quiz.create(req.body)
    res.status(StatusCodes.OK).json(quizDoc)
})
exports.getAllQuizzes = asyncWrapper(async (req, res, next) => {

    res.send('get all quizzes')
})