const Query = require("./Query")
const Mutation = require("./Mutation")

const resolvers = {
    Query,
    Question: {
        id: (root) => root._id
    }
    // Mutation
}

module.exports = resolvers