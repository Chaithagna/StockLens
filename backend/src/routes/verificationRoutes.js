import express from 'express';
import { getVerificationDetails } from '../controllers/verificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:researchId', authenticate, getVerificationDetails);

export default router;

