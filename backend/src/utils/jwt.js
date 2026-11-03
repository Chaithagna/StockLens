import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'stocklens_super_secret_jwt_key_investment_research_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

