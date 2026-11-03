import express from 'express';
import { sendAssistantMessage, getConversation } from '../controllers/assistantController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { assistantMessageValidation } from '../validations/researchValidation.js';

const router = express.Router();

router.use(authenticate);

router.post('/:researchId/message', assistantMessageValidation, validateRequest, sendAssistantMessage);
router.get('/:researchId', getConversation);

export default router;

