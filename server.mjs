import dotenv from "dotenv"
const envLoaded = dotenv.config()

if (!envLoaded) {
    console.log("Can't load environment variables now")
    process.exit(0)
}

import express from "express"
import cors from "cors"
import {authRouter, settingsRouter, quizRouter} from "./router/index.js"
import connectDB from "./helpers/connectDB.js"
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary"
import fileUpload from "express-fileupload"
import {getCookies} from "./utils/attachCookies.js"
import http from "http"
import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import typeDefs from "./graphqlServer/schema.js"
import resolvers from "./graphqlServer/resolvers.js"

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start()

cloudinary.config({
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    cloud_name: process.env.CLOUD_NAME
})

app.set('trust proxy', 1)
app.use(cors())
app.use(express.json())
app.use(fileUpload({useTempFiles: true}))
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
    res.end(`<h1>Welcome to quiz master api</h1>`)
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/settings', [getCookies, settingsRouter])
app.use('/api/v1/quizzes', [getCookies, quizRouter])

app.use(expressMiddleware(server, {}))
app.use(errorHandler)


const start =  async () => {
    try {
        await connectDB()
        await httpServer.listen({port: process.env.PORT})
        console.log(`Server is listening on  http://localhost:${process.env.PORT}`)
        // app.listen(process.env.PORT, () => {
        //     console.log(`Server is listening on port ${process.env.PORT}`)
        // })
    } catch (e) {
        console.log(e)
    }
}

await start()

