const {model, Schema} = require('mongoose')

const userScoreSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a user"]
    },
    score: Number,
})

const questionSchema = new Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    points: {
        type: Number,
        required: [true, "Please provide points for the question"]
    },
    answer: {
        type: String,
        required: [true, "An answer is required"]
    },
    explanation: {
        type: String,
        required: [true, "An explanation for the answer is required"]
    },
    options: {
        type: [String],
        required: [true, "Please provide possible answers for the question"],
        validate: [
            {
                validator: function (arr) {
                    return arr.length === 4
                },
                message: "Options can't be less or more than four"
            }
        ]
    },
})

const quizSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    coverImage: String,
    level: {
        type: String,
        required: [true, "Please provide a level"],
        enum: {
            values: ['100l', '200l', '300l', '400l', '500l',],
            message: '{VALUE} is not a supported level'
        },
    },
    subject: {
        type: String,
        required: [true, "Please provide a subject"],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide an author for the quiz"]
    },
    duration: {
        type: String,
        required: [true, "Please provide a duration in hours"]
    },
    questions: {
        type: [questionSchema],
        required: false
    },
    cloudinaryId: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'inactive',
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} is not a supported status'
        }
    },
    scores: {
        type: [userScoreSchema],
        required: false
    }
}, {timestamps: true})

const quizModel = model('Quiz', quizSchema)

module.exports = quizModel