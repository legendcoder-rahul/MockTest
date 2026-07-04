import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import questionRoutes from './routes/question.routes.js'
import authRoutes from './routes/auth.routes.js'
import submissionRoutes from './routes/submission.routes.js'
import chatRoutes from './routes/chat.routes.js'
import helmet from 'helmet'
import passport from 'passport'
import './config/passport.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(passport.initialize())

app.get("/",(req, res)=>{
    res.send("hello world")
})

app.use('/api/v1/questions',questionRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/submissions', submissionRoutes)
app.use('/api/v1/chats', chatRoutes)


export default app

