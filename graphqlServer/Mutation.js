const {PubSub} = require("graphql-subscriptions")
const pubsub = new PubSub()

const mutations = {
    setTimer: async (root, args) => {
        await pubsub.publish("GET_TIMER", {getTimer: args.duration})
        return "set timer"
    }
}

module.exports = mutations