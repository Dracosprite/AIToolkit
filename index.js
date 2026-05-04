import express from 'express';
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import colors from 'colors';
import 'dotenv/config'
import connectDB from './config/db.js';
connectDB()
import path from 'path'
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import openaiRoutes from './routes/openaiRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

app.use(cors())
app.use(express.json())
app.use((bodyParser.urlencoded({ extended: false })))
app.use(morgan('dev'))

const _filename=fileURLToPath(import.meta.url)
const _dirname=path.dirname(_filename)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/openai', openaiRoutes)
app.use('/api/v1/interview', interviewRoutes)
app.use(express.static(path.join(_dirname,'gptclone','dist')))
app.get(/.*/,(req,res)=>{
  res.sendFile(path.join(_dirname,'gptclone','dist','index.html'))
})
app.use(errorHandler)

const port = process.env.PORT || 3000

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})
