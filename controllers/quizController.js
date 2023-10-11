const asyncWrapper = require('../utils/asyncWrapper')
const Quiz = require('../models/Quiz')
const {StatusCodes} = require("http-status-codes");
const {NotFoundError, BadRequestError} = require("../errors");

exports.addQuiz = asyncWrapper(async (req, res, next) => {

    const quizDoc = await Quiz.create(req.body)
    res.status(StatusCodes.OK).json(quizDoc)
})
exports.getAllQuizzes = asyncWrapper(async (req, res, next) => {
    const {subject, level, recent} = req.query
    const query = {}
    const subjectQuery = subject?.split('-').join(' ')

    if(subject) {
        query.subject = subjectQuery
    }
    if (level) {
        query.level = level
    }

    if (recent) {
        const recentQuizzes = await Quiz.find({})
            .sort({createdAt: 1})
            .limit(4)
            .select('-questions')

        res.status(StatusCodes.OK).json({recentQuizzes, noHits: recentQuizzes.length})
    }
    const quizzes = await Quiz.find(query).select('-questions')
    res.status(StatusCodes.OK).json({data: quizzes, noHits: quizzes.length})
})

exports.filterQuiz = asyncWrapper(async (req, res, next) => {
    const {subject, level} = req.body
    const query = {}

    if(subject.length > 0) {
        query.subject = {$in: subject}
    }
    if(level.length > 0) {
        query.level = {$in: level}
    }

    const quizzes = await Quiz.find(query).select('-questions')
    res.status(StatusCodes.OK).json({data: quizzes, noHits: quizzes.length})
})