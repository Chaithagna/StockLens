import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return errorResponse(res, 'Validation failed. Please verify your input.', 400, formattedErrors);
  }
  next();
};

