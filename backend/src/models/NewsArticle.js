import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    snippet: {
      type: String,
      default: '',
    },
    sentiment: {
      type: String,
      enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'CONCERNING'],
      default: 'NEUTRAL',
    },
    category: {
      type: String,
      enum: ['REGULATORY', 'LITIGATION', 'EARNINGS', 'GOVERNANCE', 'MARKET', 'GENERAL'],
      default: 'GENERAL',
    },
    relevanceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    isFlaggedAsRisk: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
export default NewsArticle;

