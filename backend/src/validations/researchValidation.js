import { body, param, query } from 'express-validator';

export const initiateResearchValidation = [
  body('companyName')
    .trim()
    .notEmpty().withMessage('Company name or ticker is required')
    .isLength({ min: 1, max: 100 }).withMessage('Company name must be between 1 and 100 characters'),
  body('ticker').optional().trim().toUpperCase(),
  body('domain').optional().trim(),
];

export const assistantMessageValidation = [
  param('researchId')
    .isMongoId().withMessage('Valid research report ID is required'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message content cannot be empty')
    .isLength({ min: 1, max: 2000 }).withMessage('Message must not exceed 2000 characters'),
];

export const compareCompaniesValidation = [
  body('reportIds')
    .isArray({ min: 2, max: 4 }).withMessage('Must provide between 2 and 4 research report IDs to compare'),
  body('reportIds.*')
    .isMongoId().withMessage('Each ID must be a valid MongoDB report ID'),
];

