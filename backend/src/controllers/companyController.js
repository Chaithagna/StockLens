import Company from '../models/Company.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Pre-seeded well-known entities for instant autocomplete suggestions
const KNOWN_ENTITIES = [
  { name: 'Apple Inc.', ticker: 'AAPL', sector: 'Consumer Electronics & Software', country: 'United States', domain: 'apple.com' },
  { name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'Cloud Computing & Enterprise Software', country: 'United States', domain: 'microsoft.com' },
  { name: 'Tesla, Inc.', ticker: 'TSLA', sector: 'Electric Vehicles & Clean Energy', country: 'United States', domain: 'tesla.com' },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Internet Services & AI', country: 'United States', domain: 'abc.xyz' },
  { name: 'Amazon.com, Inc.', ticker: 'AMZN', sector: 'E-Commerce & Cloud Infrastructure', country: 'United States', domain: 'amazon.com' },
  { name: 'NVIDIA Corporation', ticker: 'NVDA', sector: 'Semiconductors & Accelerated Computing', country: 'United States', domain: 'nvidia.com' },
  { name: 'Meta Platforms, Inc.', ticker: 'META', sector: 'Digital Media & Social Technology', country: 'United States', domain: 'meta.com' },
  { name: 'Shell Capital Holdings Ltd (Virtual Office Test Case)', ticker: 'SHEL-SHELL', sector: 'Offshore Holding / Test Shell Entity', country: 'United States (Delaware)', domain: 'shell-holdings-virtual.wixsite.com' },
];

export const searchCompanies = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const query = q.trim();

    if (!query) {
      return successResponse(res, { companies: KNOWN_ENTITIES.slice(0, 6) }, 'Suggested companies');
    }

    // 1. Search in MongoDB Company collection
    const regex = new RegExp(query, 'i');
    const dbCompanies = await Company.find({
      $or: [{ name: regex }, { ticker: regex }, { normalizedName: regex }],
    })
      .limit(6)
      .lean();

    // 2. Filter known entities that match query
    const matchedKnown = KNOWN_ENTITIES.filter(
      (k) =>
        k.name.toLowerCase().includes(query.toLowerCase()) ||
        k.ticker.toLowerCase().includes(query.toLowerCase())
    );

    // Merge without duplicates
    const combined = [...dbCompanies];
    for (const item of matchedKnown) {
      if (!combined.some((c) => c.ticker === item.ticker || c.name.toLowerCase() === item.name.toLowerCase())) {
        combined.push(item);
      }
    }

    // If query matches nothing, suggest creating research for it
    if (combined.length === 0) {
      combined.push({
        name: query,
        ticker: query.length <= 5 ? query.toUpperCase() : '',
        sector: 'Custom Entity Query',
        country: 'Unverified Jurisdiction',
        isNewQuery: true,
      });
    }

    return successResponse(res, { companies: combined }, 'Search results retrieved');
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return errorResponse(res, 'Company record not found', 404);
    }
    return successResponse(res, { company }, 'Company details retrieved');
  } catch (error) {
    next(error);
  }
};

