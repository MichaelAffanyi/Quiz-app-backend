
const typeDefs = `#graphql
    
    type Option {
        tag: String!
        value: String!
    }
    
    type Question {
        id: String!
        question: String!
        answer: String!
        point: Int!
        explanation: String
        options: [Option!]
        status: String
    }

    input answer {
        id: String!
        value: String!
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
        quizzes(
            id: String
        ): [Quiz!]
        submitAnswers(
            quizId: String!
            answers: [answer!]
        ): [Question!]
    }
`

module.exports = typeDefs