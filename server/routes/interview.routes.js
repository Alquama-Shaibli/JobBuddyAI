import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { evaluateAnswer, generateQuestions, getInterviewHistory } from "../controllers/interview.controllers.js";

const router = express.Router();

router.post('/generate', verifyToken, generateQuestions);
router.post('/evaluate', verifyToken, evaluateAnswer);
router.get('/history', verifyToken, getInterviewHistory);

export default router;