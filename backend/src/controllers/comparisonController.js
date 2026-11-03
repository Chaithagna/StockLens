import ResearchReport from '../models/ResearchReport.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const compareReports = async (req, res, next) => {
  try {
    const { reportIds } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(reportIds) || reportIds.length < 2) {
      return errorResponse(res, 'Please provide at least 2 research reports to compare.', 400);
    }

    const reports = await ResearchReport.find({
      _id: { $in: reportIds },
      userId,
    });

    if (reports.length < 2) {
      return errorResponse(res, 'Could not retrieve at least 2 reports owned by your account.', 404);
    }

    // Structure comparison items
    const comparison = reports.map((r) => {
      const v = r.snapshotData?.verification || {};
      const f = r.snapshotData?.financials || {};
      const c = r.snapshotData?.company || {};

      return {
        id: r._id,
        companyName: r.companyName,
        ticker: r.ticker || 'N/A',
        sector: c.sector || 'N/A',
        overallSafetyScore: r.overallSafetyScore,
        overallRiskLevel: r.overallRiskLevel,
        legitimacyScore: r.legitimacyScore,
        locationType: v.locationType || 'N/A',
        isVirtualOffice: Boolean(v.isVirtualOffice),
        virtualOfficeProvider: v.virtualOfficeProvider || 'None',
        revenue: f.revenue || 0,
        netIncome: f.netIncome || 0,
        profitMargin: f.profitMargin !== undefined ? f.profitMargin : 'N/A',
        debtToEquity: f.debtToEquity !== undefined ? f.debtToEquity : 'N/A',
        currentRatio: f.currentRatio !== undefined ? f.currentRatio : 'N/A',
        solvencyRating: f.solvencyRating || 'N/A',
        redFlagsCount: r.redFlags?.length || 0,
        redFlags: r.redFlags || [],
        positiveIndicatorsCount: r.positiveIndicators?.length || 0,
        positiveIndicators: r.positiveIndicators || [],
        aiSummarySnippet: r.aiExecutiveSummary?.slice(0, 320) + '...',
      };
    });

    // Determine comparative winner in safety
    const ranked = [...comparison].sort((a, b) => b.overallSafetyScore - a.overallSafetyScore);
    const safest = ranked[0];

    return successResponse(
      res,
      {
        comparison,
        safestCompany: safest.companyName,
        verdict: `${safest.companyName} demonstrates the strongest overall safety profile with an Investment Safety Score of ${safest.overallSafetyScore}/100 and ${safest.redFlagsCount} red flags identified.`,
      },
      'Comparison matrix generated successfully'
    );
  } catch (error) {
    next(error);
  }
};

