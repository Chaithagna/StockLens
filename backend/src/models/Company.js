import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    ticker: {
      type: String,
      uppercase: true,
      trim: true,
      sparse: true,
      index: true,
    },
    normalizedName: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      trim: true,
      lowercase: true,
    },
    country: {
      type: String,
      default: 'United States',
      trim: true,
    },
    sector: {
      type: String,
      default: 'Information Technology',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Software & Technology Services',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    officialAddress: {
      type: String,
      default: '',
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    identifiers: {
      cik: { type: String, default: '' },
      ein: { type: String, default: '' },
      isin: { type: String, default: '' },
    },
    marketCapCategory: {
      type: String,
      enum: ['Mega-Cap', 'Large-Cap', 'Mid-Cap', 'Small-Cap', 'Micro-Cap', 'Private / Unknown'],
      default: 'Large-Cap',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to compute normalizedName
companySchema.pre('save', function (next) {
  if (this.name) {
    this.normalizedName = this.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  next();
});

const Company = mongoose.model('Company', companySchema);
export default Company;

