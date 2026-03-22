import express from 'express';
import { createJob, getAllJobs, skillMatching } from '../controllers/job.controllers.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/create',verifyToken, createJob);
router.get('/getAllJobs',verifyToken, getAllJobs);
router.get('/match', verifyToken, skillMatching)

export default router;