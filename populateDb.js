const mongoose = require('mongoose')
require('dotenv').config()
const Quiz = require('./models/Quiz')
const data = require('./populateDB/quiz.json')

const url = process.env.MONGO_URL.replace('<password>', process.env.DB_PASSWORD)
const populateDb = async () => {
    try {
        await mongoose.connect(url)
        await Quiz.deleteMany()
        await Quiz.create(data)
        console.log('Database populated successfully')
        process.exit(0)
    } catch (e) {
       console.log(`Can't populate database; error ${e}`)
        process.exit(1)
    }
}

populateDb()