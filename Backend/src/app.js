import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import questionRoutes from './routes/question.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/",(req, res)=>{
    res.send("hello world")
})

app.use('/api/v1/questions',questionRoutes)
app.use('/api/v1/auth', authRoutes)


export default app

