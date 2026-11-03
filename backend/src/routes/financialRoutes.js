import express from 'express';
import { getFinancialDetails } from '../controllers/financialController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:researchId', authenticate, getFinancialDetails);

export default router;

