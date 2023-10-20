
const typeDefs = `#graphql
    type Question {
        question: String!
        answer: String!
        point: Int!
        explanation: String
        options: [String!]
    }

    type Quiz {
        id: String!
        title: String!
        coverImage: String
        level: String!
        subject: String!
        author: String!
        questions: [Question!]
        duration: String!
        createdAt: Int!
        updatedAt: Int!
    }

    type Query {
        getQuiz(
            id: String
        ): [Quiz!]
    }
`

module.exports = typeDefs