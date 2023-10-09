const {model, Schema} = require('mongoose')

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        max: 4
    },
})

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner, intermediate, expert'],
    },
    author: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    questions: [questionSchema]
})

const quizModel = model('Quiz', quizSchema)

module.exports = quizModel