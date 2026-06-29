import express from 'express'
import cors from 'cors'
import questionRoutes from './routes/question.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get("/",(req, res)=>{
    res.send("hello world")
})

app.use('/api/v1/questions',questionRoutes)


export default app

