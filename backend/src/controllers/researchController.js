import ResearchReport from '../models/ResearchReport.js';
import Company from '../models/Company.js';
import { runResearchPipeline } from '../services/researchPipelineService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const initiateResearch = async (req, res, next) => {
  try {
    const { companyName, ticker = '', domain = '' } = req.body;
    const userId = req.user._id;

    // Disambiguate or link company
    let company = await Company.findOne({
      $or: [
        { ticker: ticker ? ticker.toUpperCase() : '__NONE__' },
        { normalizedName: companyName.toLowerCase().replace(/[^a-z0-9]/g, '') },
      ],
    });

    if (!company) {
      company = await Company.create({
        name: companyName,
        ticker: ticker ? ticker.toUpperCase() : '',
        domain: domain || `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      });
    }

    // Create research report in PENDING state
    const report = await ResearchReport.create({
      userId,
      companyId: company._id,
      companyName: company.name,
      ticker: company.ticker,
      status: 'PENDING',
      currentStage: 1,
      stageProgress: 5,
      stageLogs: [
        {
          stage: 1,
          stageName: 'Research Request Queued',
          message: `Due diligence initiated for ${company.name}. Initializing 8-stage verification pipeline.`,
          status: 'in_progress',
          timestamp: new Date(),
        },
      ],
    });

    // Run the pipeline asynchronously in background
    runResearchPipeline(report._id, req.user.apiKeys || {}).catch((err) => {
      console.error(`[Async Pipeline Execution Error]:`, err);
    });

    return successResponse(
      res,
      { report },
      'Research pipeline initialized successfully',
      202
    );
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await ResearchReport.findById(id);

    if (!report) {
      return errorResponse(res, 'Research report not found', 404);
    }

    // Verify user isolation (only owner or admin)
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied. You can only view your own research reports.', 403);
    }

    return successResponse(res, { report }, 'Research report retrieved');
  } catch (error) {
    next(error);
  }
};

export const getResearchHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, risk = '', search = '', sort = '-createdAt' } = req.query;

    const query = { userId };

    if (risk) {
      query.overallRiskLevel = risk.toUpperCase();
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ companyName: regex }, { ticker: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await ResearchReport.countDocuments(query);
    const reports = await ResearchReport.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-snapshotData.rawMapsData')
      .lean();

    return paginatedResponse(res, reports, page, limit, total, 'Research history retrieved');
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await ResearchReport.findOne({ _id: id, userId: req.user._id });

    if (!report) {
      return errorResponse(res, 'Report not found or you do not have permission to delete it', 404);
    }

    await ResearchReport.findByIdAndDelete(id);
    return successResponse(res, null, 'Research report deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalResearched = await ResearchReport.countDocuments({ userId });
    const lowRiskCount = await ResearchReport.countDocuments({ userId, overallRiskLevel: 'LOW' });
    const moderateRiskCount = await ResearchReport.countDocuments({ userId, overallRiskLevel: 'MODERATE' });
    const highRiskCount = await ResearchReport.countDocuments({ userId, overallRiskLevel: 'HIGH' });
    const criticalRiskCount = await ResearchReport.countDocuments({ userId, overallRiskLevel: 'CRITICAL' });

    const recentReports = await ResearchReport.find({ userId })
      .sort('-createdAt')
      .limit(5)
      .select('companyName ticker overallSafetyScore overallRiskLevel legitimacyScore status createdAt')
      .lean();

    const recentActivity = await ResearchReport.find({ userId })
      .sort('-updatedAt')
      .limit(6)
      .select('companyName ticker currentStage stageProgress status updatedAt')
      .lean();

    return successResponse(
      res,
      {
        totalResearched,
        riskDistribution: {
          low: lowRiskCount,
          moderate: moderateRiskCount,
          high: highRiskCount,
          critical: criticalRiskCount,
        },
        recentReports,
        recentActivity,
      },
      'Dashboard metrics retrieved'
    );
  } catch (error) {
    next(error);
  }
};

