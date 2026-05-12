import express from 'express';
import { createMockTest, getAllMockTest, getMockTestbyId, submitMockTest } from '../controllers/mockTest.controllers.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/create',verifyToken, createMockTest);
router.get('/', verifyToken, getAllMockTest)
router.get('/:id', verifyToken, getMockTestbyId)
router.post('/submit/:id', verifyToken, submitMockTest)

export default router;