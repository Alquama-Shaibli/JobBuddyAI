import express from 'express';
import { getProfile, profileUpdate } from '../controllers/user.controllers.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/profile',verifyToken, getProfile)
router.patch('/profile/:userId',verifyToken, profileUpdate)

export default router;