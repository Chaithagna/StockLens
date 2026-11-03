import express from 'express';
import {
  initiateResearch,
  getReportById,
  getResearchHistory,
  deleteReport,
  getDashboardStats,
} from '../controllers/researchController.js';
import { compareReports } from '../controllers/comparisonController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import {
  initiateResearchValidation,
  compareCompaniesValidation,
} from '../validations/researchValidation.js';

const router = express.Router();

router.use(authenticate); // All research routes require JWT authentication

router.post('/', initiateResearchValidation, validateRequest, initiateResearch);
router.get('/history', getResearchHistory);
router.get('/dashboard-stats', getDashboardStats);
router.post('/compare', compareCompaniesValidation, validateRequest, compareReports);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

export default router;

