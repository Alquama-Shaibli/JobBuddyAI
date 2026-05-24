// import dotenv from 'dotenv'
import './config/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

// files import
import connectDb from './db/db.js';
import errorHandler from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';
import mockTestRoutes from './routes/mockTest.routes.js';
import resultRoutes from './routes/result.routes.js';
import chatRoutes from './routes/chat.routes.js';
import resumeRoutes from './routes/resume.routes.js'

// // config dotenv
// dotenv.config({
//   path: './.env'
// })

// config db
connectDb()

// config express
const app = express();

// cors config
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// config port
const PORT = process.env.PORT || 8080

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/mock-test', mockTestRoutes);
app.use('/api/v1/result', resultRoutes);
app.use('/api/v1/ai', chatRoutes);
app.use('/api/v1/resume', resumeRoutes);

// error handler middleware
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is connected on http://localhost:${PORT}`.bgCyan.white);
})

