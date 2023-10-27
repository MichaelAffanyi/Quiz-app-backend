const Query = require("./Query")
const Mutation = require("./Mutation")
const Subscription = require("./Subscription")

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Question: {
        options: (root) => {
            const tags = ['A', 'B', 'C', 'D']
            return root.options.map((ele, index) => {
                return {
                    tag: tags[index],
                    value: ele
                }
            })
        }
    },
    Answers: {
        percentage: (root) => {
            const total = root.answers.length
            let correctTotal = 0
            root.answers.forEach(answer => {
                answer.status === 'correct' && correctTotal++
            })
            return ((correctTotal / total) * 100).toFixed(2)
        }
    }
}

module.exports = resolvers