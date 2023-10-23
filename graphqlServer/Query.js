const Quiz = require("../models/Quiz");

const queries = {
    quizzes: async (root, args) => {
        const query = {}
        if(args.id) {
            query._id = args.id
        }
        return Quiz.find(query)
    },
    submitAnswers: async (root, args) => {
        const {quizId, answers} = args
        const questions = await Quiz.findOne({_id: quizId}).select('questions')
        answers.forEach(answer => {
            const questionObj = questions.questions.find(question => question._id.toString() === answer.id)
            const isCorrect = questionObj.answer === answer.value
            if (isCorrect) {
                questionObj.status = "correct"
            } else {
                questionObj.status = "incorrect"
            }
        })
        return questions.questions
    }
}

module.exports = queries