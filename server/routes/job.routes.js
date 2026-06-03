import express from 'express';
import { createJob, getAllJobs, skillMatching, getJobRecommendations } from '../controllers/job.controllers.js';
import verifyToken from '../middlewares/verifyToken.js';
import requireOnboarded from '../middlewares/requireOnboarded.js';

const router = express.Router();

router.post('/create', verifyToken, createJob);
router.get('/getAllJobs', verifyToken, getAllJobs);
router.get('/match', verifyToken, skillMatching);
router.post('/recommendations', verifyToken, requireOnboarded, getJobRecommendations);

export default router;