import express from "express";
import verifyToken from '../middlewares/verifyToken.js'
import upload from "../middlewares/upload.middleware.js";
import { uploadResume } from "../controllers/resume.controllers.js";

const router = express.Router();

router.post('/upload', verifyToken, upload.single('resume'),uploadResume);

export default router;