import express from 'express'
import { loginUser, registerUser } from '../controllers/auth.controllers.js';

const app = express();

app.post('/signup', registerUser);
app.post('/login', loginUser);


export default app;