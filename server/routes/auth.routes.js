import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', verifyToken, logoutUser);

export default router;