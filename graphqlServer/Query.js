const Quiz = require("../models/Quiz");
const {PubSub} = require("graphql-subscriptions")
const pubsub = new PubSub()

const queries = {
    quizzes: async (root, args) => {
        const query = {}
        if(args.id) {
            query._id = args.id
        }
        await pubsub.publish("GET_TIMER", {getTimer: "hello"})
        return Quiz.find(query)
    },
    submitAnswers: async (root, args) => {
        const {quizId, answers} = args
        const questions = await Quiz.findOne({_id: quizId}).select('questions')
        const newAnswers = questions.questions.map(question => {
            const answer = answers.find(answer => answer.id === question._id.toString())
            const isCorrect = answer.value === question.answer
            return {
                id: question._id,
                points: question.points,
                answer: question.answer,
                explanation: question.explanation,
                options: question.options,
                question: question.question,
                status: isCorrect ? "correct" : "incorrect"
            }
        })
        return {answers: newAnswers}
    }
}

module.exports = queries