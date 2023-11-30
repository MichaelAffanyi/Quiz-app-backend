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
        const {quizId, answers, userId} = args
        const quiz = await Quiz.findOne({_id: quizId})
        const totalQuestions = quiz.questions.length
        let score = 0
        const newAnswers = quiz.questions.map(question => {
            let isCorrect = false
            const answer = answers.find(answer => answer.id === question._id.toString())
            if (answer) {
                isCorrect = answer.value === question.answer
            }
            if (isCorrect) {
                score += question.points
            }
            return {
                id: question._id,
                point: question.points,
                answer: question.answer,
                selectedOption: answer ? answer.value : null,
                explanation: question.explanation,
                options: question.options,
                question: question.question,
                status: isCorrect ? "correct" : "incorrect"
            }
        })
        const userScoreObject = {
            user: userId,
            score
        }
        quiz.scores.push(userScoreObject)
        quiz.save()
        await pubsub.publish('GET_TIMER', {getTimer: "timer"})
        return {answers: newAnswers}
    }
}

module.exports = queries