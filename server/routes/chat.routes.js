import express from 'express';
import verifyToken  from '../middlewares/verifyToken.js'
import { chatWithAI } from '../controllers/chat.controllers.js';

const router = express.Router();

router.post('/chat', verifyToken, chatWithAI)

export default router;