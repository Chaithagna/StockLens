import express from 'express';
import authRoutes from './authRoutes.js';
import companyRoutes from './companyRoutes.js';
import researchRoutes from './researchRoutes.js';
import verificationRoutes from './verificationRoutes.js';
import financialRoutes from './financialRoutes.js';
import assistantRoutes from './assistantRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/research', researchRoutes);
router.use('/verification', verificationRoutes);
router.use('/financials', financialRoutes);
router.use('/assistant', assistantRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StockLens AI Investment Researcher API',
    version: '1.0.0',
  });
});

export default router;

