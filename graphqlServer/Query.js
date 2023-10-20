const Quiz = require("../models/Quiz");

const queries = {
    getQuiz: async (root, args) => {
        const query = {}
        if(args.id) {
            query._id = args.id
        }
        return Quiz.find(query)
    }
}

module.exports = queries