import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getResultById, getResultsAnalytics, getUserResults } from '../controllers/result.controllers.js';

const router = express.Router();

router.get('/my-results', verifyToken, getUserResults);
router.get('/analytics', verifyToken, getResultsAnalytics);
router.get('/:id', verifyToken, getResultById);

export default router;