
const typeDefs = `#graphql
    
    type Option {
        tag: String!
        value: String!
    }

    type Answers {
        answers: [Question!]
        percentage: Int
    }
    
    type Question {
        id: String!
        question: String!
        answer: String!
        point: Int!
        explanation: String
        options: [Option!]
        status: String
        selectedOption: String
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
            userId: String!
            answers: [answer!]
        ): Answers!
    }

    type Mutation {
        setTimer(duration: String!): String!
    }

    type Subscription {
        getTimer: String!
    }
`

module.exports = typeDefs