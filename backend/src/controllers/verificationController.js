import CompanyVerification from '../models/CompanyVerification.js';
import ResearchReport from '../models/ResearchReport.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getVerificationDetails = async (req, res, next) => {
  try {
    const { researchId } = req.params;

    const report = await ResearchReport.findById(researchId);
    if (!report) {
      return errorResponse(res, 'Research report not found', 404);
    }

    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied', 403);
    }

    let verification = await CompanyVerification.findOne({ researchId });
    if (!verification && report.snapshotData?.verification) {
      verification = report.snapshotData.verification;
    }

    if (!verification) {
      return errorResponse(res, 'Verification record not found for this research', 404);
    }

    return successResponse(res, { verification }, 'Company verification details retrieved');
  } catch (error) {
    next(error);
  }
};

