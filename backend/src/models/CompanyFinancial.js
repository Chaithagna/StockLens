import mongoose from 'mongoose';

const companyFinancialSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    researchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResearchReport',
      index: true,
    },
    fiscalYear: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
    currency: {
      type: String,
      default: 'USD',
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    netIncome: {
      type: Number,
      default: 0,
    },
    operatingCashFlow: {
      type: Number,
      default: 0,
    },
    totalDebt: {
      type: Number,
      default: 0,
    },
    totalCash: {
      type: Number,
      default: 0,
    },
    peRatio: {
      type: Number,
      default: null,
    },
    debtToEquity: {
      type: Number,
      default: null,
    },
    currentRatio: {
      type: Number,
      default: null,
    },
    profitMargin: {
      type: Number,
      default: null, // In percentage e.g., 22.5
    },
    revenueGrowthYoY: {
      type: Number,
      default: null, // In percentage e.g., 8.2
    },
    annualHistory: [
      {
        year: { type: Number, required: true },
        revenue: { type: Number, required: true },
        netIncome: { type: Number, required: true },
        operatingCashFlow: { type: Number, default: 0 },
        freeCashFlow: { type: Number, default: 0 },
      },
    ],
    solvencyRating: {
      type: String,
      enum: ['EXCELLENT', 'SOUND', 'MODERATE', 'VULNERABLE', 'DISTRESSED'],
      default: 'SOUND',
    },
  },
  {
    timestamps: true,
  }
);

const CompanyFinancial = mongoose.model('CompanyFinancial', companyFinancialSchema);
export default CompanyFinancial;

