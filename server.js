const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const {authRouter} = require('./router')
const connectDB = require('./helpers/connectDB')
const errorHandler = require('./middleware/errorHandler')
const coockieParser = require('cookie-parser')

if(dotenv.error) {
    console.log(`Can't load environment variables now. Error: ${dotenv.error}`)
    process.exit(1)
}


app.use(express.json())
app.use(coockieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
    res.end(`<h1>Welcome to quiz master api</h1>`)
})
app.use('/api/v1', authRouter)

app.use(errorHandler)


const start =  async () => {
    try {
        await connectDB()
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()

// start().then(r =>
//
// )

