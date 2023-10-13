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

exports.getSingleQuiz = asyncWrapper(async (req, res, next) => {
    const {id} = req.params
    if (!id) {
        throw new BadRequestError('Please provide id')
    }

    const quiz = await Quiz.findById(id)
    if (!quiz) {
        throw new NotFoundError(`No quiz found with id ${id}`)
    }

    res.status(StatusCodes.OK).json(quiz)
})

exports.getQuestion = asyncWrapper(async (req, res, next) => {
    const {id, questionNo} = req.params
    if (!id || !questionNo) {
        throw new BadRequestError('Please provide id and question number')
    }

    const result = await Quiz.findById(id).select(['-questions.answer', '-questions.explanation', '-_id', '-coverImage', ])
    if (!result) {
        throw new NotFoundError(`No quiz found with id ${id}`)
    }
    const index = Number(questionNo) - 1
    const question = result.questions[index]

    const total = result.questions.length
    const hasMore = !(index === (total - 1))

    res.status(StatusCodes.OK).json({question, total, hasMore})
})