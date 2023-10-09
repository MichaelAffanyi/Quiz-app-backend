const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const {authRouter, settingsRouter, quizRouter} = require('./router')
const connectDB = require('./helpers/connectDB')
const errorHandler = require('./middleware/errorHandler')
const coockieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2
const fileUpload = require('express-fileupload')
const {getCookies} = require("./utils/attachCookies");

if(dotenv.error) {
    console.log(`Can't load environment variables now. Error: ${dotenv.error}`)
    process.exit(1)
}
cloudinary.config({
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    cloud_name: process.env.CLOUD_NAME
})

app.set('trust proxy', 1)
app.use(cors())
app.use(express.json())
app.use(fileUpload({useTempFiles: true}))
app.use(coockieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
    res.end(`<h1>Welcome to quiz master api</h1>`)
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/settings', [getCookies, settingsRouter])
app.use('/api/v1/quizzes', [getCookies, quizRouter])

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

