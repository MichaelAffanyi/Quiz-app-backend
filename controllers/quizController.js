const asyncWrapper = require('../utils/asyncWrapper')
const Quiz = require('../models/Quiz')
const {StatusCodes} = require("http-status-codes");
const {NotFoundError, BadRequestError} = require("../errors");
const cloudinary = require('cloudinary').v2
const fs = require("fs");

exports.addQuiz = asyncWrapper(async (req, res, next) => {
    const {subject, level, title, duration, author} = req.body
    // console.log(req.files)
    if (!subject || !level || !title || !duration || !author || !req.files) {
        throw new BadRequestError('Please provide all required fields')
    }

    const {coverImage} = req.files
    if (!coverImage.mimetype.startsWith('image')) {
        throw new BadRequestError('Please provide an image')
    }
    const result = await cloudinary.uploader.upload( coverImage.tempFilePath, {
        file: coverImage.tempFilePath,
        folder: 'quiz-app/quiz cover images',
        public_id: coverImage.name,
        overwrite: true,
        use_filename: true,
        resource_type: 'auto'

    })

    fs.unlinkSync(coverImage.tempFilePath)

    req.body.coverImage = result.secure_url
    req.body.cloudinaryId = result.public_id

    const quizDoc = await Quiz.create(req.body)
    res.status(StatusCodes.OK).json(quizDoc)
})

exports.updateQuizQuestion = asyncWrapper(async (req, res, next) => {
    const {id} = req.params
    const {question, answer, points, explanation, options} = req.body
    if(!question || !answer || !points || !explanation || !options) {
        throw new BadRequestError('Please provide all required fields')
    }
    if (!id) {
        throw new BadRequestError('Please provide id')
    }

    const quiz = await Quiz.findById(id)
    if (!quiz) {
        throw new NotFoundError('Invalid quiz id')
    }

    const questionObj = {
        question,
        answer,
        points,
        explanation,
        options
    }

    quiz.questions.push(questionObj)
    await quiz.save()

    res.status(StatusCodes.OK).json({msg: 'Question added'})

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
            .sort({createdAt: -1})
            .limit(4)
            .select('-questions')

        return res.status(StatusCodes.OK).json({recentQuizzes, noHits: recentQuizzes.length})
    }
    const quizzes = await Quiz.find(query).select('-questions').populate('author', 'name')
    res.status(StatusCodes.OK).json({data: quizzes, noHits: quizzes.length})
})

exports.getLecturerQuizzes = asyncWrapper(async (req, res, next) => {
    const {id} = req.user
    const quizzes = await Quiz.find({author: id}).select(['_id', 'title', 'duration', 'status', 'scores'])
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