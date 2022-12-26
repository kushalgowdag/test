import express from "express"
import dotenv from "dotenv"
import UserRouter from "./Routers/UserRouter.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import fileUpload from "express-fileupload"
import passport from "passport"
import cookieSession from "cookie-session"

const app = express()
dotenv.config()


app.use(cors({
    origin: "http://localhost:3000",
    Credential: true
}))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 *1024 },
    useTempFiles: true
}))
app.use(cookieSession({
    name: "session",
    keys: ["test"],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(passport.initialize())
app.use(passport.session())


app.use("/", UserRouter)

export default app