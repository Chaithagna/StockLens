import mongoose from 'mongoose';

const riskVectorSchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 100, default: 20 },
    level: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'LOW' },
    analysis: { type: String, default: '' },
    flags: [{ type: String }],
  },
  { _id: false }
);

const researchReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ticker: {
      type: String,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IDENTIFYING', 'VERIFYING_LOCATION', 'INVESTIGATING_ONLINE', 'RESEARCHING_BACKGROUND', 'COLLECTING_FINANCIALS', 'SCANNING_NEWS', 'ANALYZING_RISK', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    currentStage: {
      type: Number,
      min: 1,
      max: 8,
      default: 1,
    },
    stageProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },
    stageLogs: [
      {
        stage: { type: Number, required: true },
        stageName: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['pending', 'in_progress', 'completed', 'warning', 'failed'], default: 'in_progress' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    legitimacyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    overallSafetyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    overallRiskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      index: true,
    },
    riskBreakdown: {
      financialRisk: { type: riskVectorSchema, default: () => ({ score: 20, level: 'LOW', analysis: 'Solvent balance sheet with positive cash flows.' }) },
      businessRisk: { type: riskVectorSchema, default: () => ({ score: 25, level: 'LOW', analysis: 'Competitive moats in primary market segment.' }) },
      regulatoryRisk: { type: riskVectorSchema, default: () => ({ score: 15, level: 'LOW', analysis: 'No material active enforcement actions detected.' }) },
      governanceRisk: { type: riskVectorSchema, default: () => ({ score: 20, level: 'LOW', analysis: 'Independent board leadership and stable executive structure.' }) },
      legitimacyRisk: { type: riskVectorSchema, default: () => ({ score: 10, level: 'LOW', analysis: 'Physical commercial address and legitimate enterprise registrations verified.' }) },
    },
    redFlags: [
      {
        category: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
        source: { type: String, default: 'Regulatory & Physical Presence Analysis' },
      },
    ],
    positiveIndicators: [
      {
        category: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        impact: { type: String, enum: ['HIGH', 'MODERATE'], default: 'HIGH' },
      },
    ],
    aiExecutiveSummary: {
      type: String,
      default: '',
    },
    evidenceCitations: [
      {
        title: { type: String, required: true },
        type: { type: String, enum: ['Google Maps Place', 'Financial Statement', 'SEC Filing', 'News Investigation', 'Business Registry', 'Domain Forensics'], default: 'News Investigation' },
        url: { type: String, default: '' },
        excerpt: { type: String, default: '' },
      },
    ],
    snapshotData: {
      company: { type: mongoose.Schema.Types.Mixed },
      verification: { type: mongoose.Schema.Types.Mixed },
      financials: { type: mongoose.Schema.Types.Mixed },
      news: [{ type: mongoose.Schema.Types.Mixed }],
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying & user isolation
researchReportSchema.index({ userId: 1, createdAt: -1 });
researchReportSchema.index({ userId: 1, overallRiskLevel: 1 });
researchReportSchema.index({ companyName: 'text', ticker: 'text' });

const ResearchReport = mongoose.model('ResearchReport', researchReportSchema);
export default ResearchReport;

