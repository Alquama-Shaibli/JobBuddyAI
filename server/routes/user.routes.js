import express from 'express';
import { profileUpdate } from '../controllers/user.controllers.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.patch('/profile/:userId',verifyToken, profileUpdate)

export default router;