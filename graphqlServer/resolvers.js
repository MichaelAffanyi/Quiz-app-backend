const Query = require("./Query")
const Mutation = require("./Mutation")
const Subscription = require("./Subscription")

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Question: {
        id: (root) => root._id,
        options: (root) => {
            const tags = ['A', 'B', 'C', 'D']
            return root.options.map((ele, index) => {
                return {
                    tag: tags[index],
                    value: ele
                }
            })
        }
    }
}

module.exports = resolvers