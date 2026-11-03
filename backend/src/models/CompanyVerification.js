import mongoose from 'mongoose';

const companyVerificationSchema = new mongoose.Schema(
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
    placeId: {
      type: String,
      default: '',
    },
    formattedAddress: {
      type: String,
      default: '',
    },
    locationType: {
      type: String,
      enum: ['HQ / Corporate Campus', 'Commercial Office', 'Shared / Coworking Space', 'Virtual Office', 'Residential Address', 'Unverified / Unknown'],
      default: 'Commercial Office',
    },
    isVirtualOffice: {
      type: Boolean,
      default: false,
    },
    virtualOfficeProvider: {
      type: String,
      default: null, // e.g., 'Regus', 'WeWork', 'Davinci Virtual', 'Opus Virtual Offices'
    },
    googleRating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    userRatingsTotal: {
      type: Number,
      default: 0,
    },
    businessStatus: {
      type: String,
      enum: ['OPERATIONAL', 'CLOSED_TEMPORARILY', 'CLOSED_PERMANENTLY', 'UNKNOWN'],
      default: 'OPERATIONAL',
    },
    streetViewAvailable: {
      type: Boolean,
      default: false,
    },
    streetViewImageUrl: {
      type: String,
      default: '',
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },
    registryMatchStatus: {
      type: String,
      enum: ['VERIFIED_MATCH', 'PARTIAL_MATCH', 'UNVERIFIED', 'MISMATCH_DETECTED'],
      default: 'VERIFIED_MATCH',
    },
    legitimacyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    findings: [
      {
        type: { type: String, enum: ['POSITIVE', 'WARNING', 'CRITICAL', 'INFO'] },
        title: { type: String, required: true },
        description: { type: String, required: true },
        evidence: { type: String, default: '' },
      },
    ],
    rawMapsData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const CompanyVerification = mongoose.model('CompanyVerification', companyVerificationSchema);
export default CompanyVerification;

