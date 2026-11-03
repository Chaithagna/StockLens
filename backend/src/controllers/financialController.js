import CompanyFinancial from '../models/CompanyFinancial.js';
import ResearchReport from '../models/ResearchReport.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getFinancialDetails = async (req, res, next) => {
  try {
    const { researchId } = req.params;

    const report = await ResearchReport.findById(researchId);
    if (!report) {
      return errorResponse(res, 'Research report not found', 404);
    }

    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied', 403);
    }

    let financials = await CompanyFinancial.findOne({ researchId });
    if (!financials && report.snapshotData?.financials) {
      financials = report.snapshotData.financials;
    }

    if (!financials) {
      return errorResponse(res, 'Financial records not found for this report', 404);
    }

    return successResponse(res, { financials }, 'Financial metrics retrieved');
  } catch (error) {
    next(error);
  }
};

