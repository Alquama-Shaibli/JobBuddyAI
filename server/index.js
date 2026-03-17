import express from 'express';
import dotenv from 'dotenv'

// files import
import connectDb from './db/db.js';
import errorHandler from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser';

// config dotenv
dotenv.config()

// config db
connectDb()

// config express
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// config port
const PORT = process.env.PORT || 8080

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// error handler middleware
app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is connected on http://localhost:${PORT}`.bgCyan.white);
})

