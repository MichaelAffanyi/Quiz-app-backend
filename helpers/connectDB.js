const {connect} = require('mongoose')

const connectDB = async () => {
    const url = process.env.MONGO_URL.replace('<password>', process.env.DB_PASSWORD)
    try {
        await connect(url)
        console.log('Database connected successfully')
    } catch (e) {
       console.log(`Can't connect to database. Error: ${e}`)
    }
}

module.exports = connectDB