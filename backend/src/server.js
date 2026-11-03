import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import User from './models/User.js';
import Company from './models/Company.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Seed initial demo data for smooth first-time experience
const seedInitialData = async () => {
  try {
    const demoEmail = 'demo@stocklens.com';
    const existingDemo = await User.findOne({ email: demoEmail });

    if (!existingDemo) {
      console.log('[Seed] Seeding demo investor account...');
      await User.create({
        name: 'Alexander Hamilton',
        email: demoEmail,
        password: 'Password123!',
        role: 'analyst',
        preferences: {
          theme: 'dark',
          riskTolerance: 'moderate',
          notificationsEnabled: true,
        },
      });
      console.log(`[Seed] Demo account created: ${demoEmail} (Password: Password123!)`);
    }

    // Seed default companies if collection is empty
    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log('[Seed] Seeding foundational company profiles...');
      await Company.create([
        {
          name: 'Apple Inc.',
          ticker: 'AAPL',
          domain: 'apple.com',
          country: 'United States',
          sector: 'Consumer Technology & Electronics',
          industry: 'Hardware & OS Ecosystems',
          officialAddress: 'One Apple Park Way, Cupertino, CA 95014, United States',
          marketCapCategory: 'Mega-Cap',
          isPublic: true,
        },
        {
          name: 'Microsoft Corporation',
          ticker: 'MSFT',
          domain: 'microsoft.com',
          country: 'United States',
          sector: 'Cloud & Enterprise Computing',
          industry: 'Productivity & Azure Cloud',
          officialAddress: 'One Microsoft Way, Redmond, WA 98052, United States',
          marketCapCategory: 'Mega-Cap',
          isPublic: true,
        },
        {
          name: 'Tesla, Inc.',
          ticker: 'TSLA',
          domain: 'tesla.com',
          country: 'United States',
          sector: 'Clean Energy & Automotive',
          industry: 'EV Manufacturing & Autonomy',
          officialAddress: '1 Tesla Road, Austin, TX 78725, United States',
          marketCapCategory: 'Large-Cap',
          isPublic: true,
        },
      ]);
      console.log('[Seed] Foundational companies seeded successfully.');
    }
  } catch (seedErr) {
    console.warn('[Seed Warning]:', seedErr.message);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 StockLens AI Backend running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🛡️  Health check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });

    const handleExit = async () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', handleExit);
    process.on('SIGINT', handleExit);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

