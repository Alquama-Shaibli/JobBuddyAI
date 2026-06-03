import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import requireOnboarded from "../middlewares/requireOnboarded.js";
import { generateQuiz, submitQuiz } from "../controllers/quiz.controllers.js";

const router = express.Router();

// Generate a new 10-question MCQ quiz based on a tag
router.post("/generate", verifyToken, requireOnboarded, generateQuiz);

// Submit answers and get evaluated score
router.post("/submit", verifyToken, submitQuiz);

export default router;
