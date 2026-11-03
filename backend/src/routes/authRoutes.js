import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validation.js';
import { registerValidation, loginValidation, updateProfileValidation } from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validateRequest, register);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfileValidation, validateRequest, updateProfile);

export default router;

