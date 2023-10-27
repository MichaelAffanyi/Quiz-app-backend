const {PubSub} = require("graphql-subscriptions")
const pubsub = new PubSub()

const subscription = {
    getTimer: {
        subscribe: () =>  pubsub.asyncIterator("GET_TIMER")
    }
}

module.exports = subscription