import express from 'express';
import { searchCompanies, getCompanyById } from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', searchCompanies);
router.get('/:id', authenticate, getCompanyById);

export default router;

