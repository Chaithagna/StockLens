# StockLens — AI Investment Researcher
### Institutional-Grade Due Diligence & Corporate Legitimacy Platform

StockLens is a full-stack AI-powered investment research platform designed to automate and deepen due diligence on corporate entities. Traditional investment terminals focus predominantly on stock price metrics and standardized earnings calls. StockLens centralizes forensic due diligence across three critical pillars:

1. **Physical Location Verification**: Querying Google Maps Places and Street View to verify genuine commercial footprint versus virtual offices or coworking maildrop shells (e.g., Regus, WeWork).
2. **Financial Solvency Diagnostics**: Multi-year audits of balance sheets, revenue/profit trajectories, Debt-to-Equity, and Current Ratios.
3. **Forensic News & Regulatory Scans**: Aggregating public regulatory enforcement actions (SEC filings, court disputes, and governance shifts) into an overall **Investment Safety Score (0–100)**.

---

## 🎨 Visual Design System & Theme

StockLens features a premium, white-background institutional financial research theme engineered for high readability, clean visual hierarchy, and an editorial financial aesthetic.

### Palette
- **Main Background**: `#F7F9FC`
- **Card Background**: `#FFFFFF`
- **Primary Text**: `#172033`
- **Secondary Text**: `#68758A`
- **Primary Blue**: `#315CF5`
- **Secondary Teal**: `#16A6A0`
- **Border**: `#E6EAF0`
- **Semantic Risk Colors**:
  - **Low Risk**: `#159B70` (Success Green)
  - **Moderate Risk**: `#E9A23B` (Warning Amber)
  - **High Risk**: `#F97316` (High Risk Orange)
  - **Critical Risk**: `#E05252` (Critical Danger Red)

---

## 🚀 Key Features & 13 Specialized Modules

- **Landing Page**: Modern fintech showcase with hero headline *"Research Smarter. Invest With Clarity."*, 5 core feature breakdowns, live terminal preview, and a 3-step workflow.
- **User Dashboard**: Live diligence counts (Low, Moderate, High, Critical), Recharts risk distribution donut chart, quick company search, and recent activity streams.
- **Company Search & Disambiguation**: Autocomplete entity matching, alias identification, and test shell company profiles.
- **8-Stage Asynchronous Pipeline**: Real-time progress tracker reflecting backend pipeline execution without fabricated states.
- **Legitimacy Verification**: Physical address analysis, Google Maps embed, street view verification, virtual office detection, and registry status.
- **Financial Analysis**: Interactive Recharts multi-year revenue and net income bars, solvency health rating, and liquidity ratios.
- **Multi-Vector Risk Assessment**: 5-dimension risk scoring (Financial, Business, Regulatory, Governance, Legitimacy) with granular red flag categorization.
- **Research Archive & History**: Private historical report snapshots, risk filtering, and longitudinal tracking.
- **Side-by-Side Comparison**: Multi-company comparative matrix highlighting safety scores, solvency ratings, and red flag differentials.
- **AI Research Assistant**: Contextual multi-turn Q&A powered by Google Gemini (with failover model cascades and institutional forensic heuristic fallback), strictly grounded in verified dossier facts with dynamic citation extraction and prompt injection defense.
- **User Settings & Custom Keys**: Configure custom API keys (Google Maps, Finnhub, Tavily, Gemini, OpenAI) with zero-config server fallbacks.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite build tool)
- **Language**: JavaScript (ES Modules)
- **Styling**: Tailwind CSS (Light institutional financial theme)
- **Routing**: React Router DOM (v6)
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized interceptors

### Backend
- **Runtime**: Node.js (v24+)
- **Framework**: Express.js
- **Architecture**: Modular Monolith (JavaScript ES Modules: `import`/`export`)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs password hashing (12 salt rounds)
- **Validation**: Express-Validator
- **Security & Resilience**: Helmet, CORS, Express-Rate-Limit, custom prompt injection defense

---

## 📂 Project Architecture

```
StockLens/
├── backend/
│   ├── src/
│   │   ├── config/             # MongoDB connection with local mongod auto-spawn (db.js)
│   │   ├── models/             # Mongoose schemas: User, Company, ResearchReport, etc.
│   │   ├── controllers/        # Request handlers: auth, company, research, verification, financial, assistant, comparison
│   │   ├── routes/             # RESTful Express route definitions
│   │   ├── middleware/         # JWT auth, error handler, rate limiters, validation
│   │   ├── services/           # External APIs: GoogleMaps, Finnhub, Tavily, AI Engine
│   │   ├── utils/              # Response formats, JWT sign/verify, sanitizers
│   │   ├── validations/        # Express-validator schemas
│   │   ├── app.js              # Express app configuration & middleware
│   │   └── server.js           # Server bootstrap & demo account seeder
│   ├── tests/
│   │   └── api.test.js         # 17-step end-to-end integration test suite
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Brand logos & icons
│   │   ├── components/common/  # Navbar, Sidebar, StatCard, RiskBadge, StageTracker, SafetyScoreGauge
│   │   ├── layouts/            # DashboardLayout, AuthLayout
│   │   ├── context/            # AuthContext, ResearchContext
│   │   ├── pages/              # 13 dedicated pages matching SRS
│   │   ├── services/           # Centralized Axios API instances
│   │   ├── utils/              # Number, currency, date, and risk color formatters
│   │   ├── App.jsx             # React Router routing & ProtectedRoute
│   │   └── main.jsx            # Application entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── README.md
└── package.json
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017/stocklens`, or MongoDB Atlas URI)

### 1. Installation
```bash
npm run install:all
```

### 2. Environment Configuration
```bash
cp backend/.env.example backend/.env
```

### 3. Launching the Backend Server
```bash
npm run start:backend
# Server starts at http://localhost:5000 and auto-seeds the demo account.
```

### 4. Launching the Frontend Application
In a separate terminal:
```bash
npm run start:frontend
# Starts Vite dev server at http://localhost:5173
```

---

## 🔑 Demo Account Credentials
For instant evaluation without manual registration, a pre-seeded analyst account is ready:
- **Email**: `demo@stocklens.com`
- **Password**: `Password123!`
*(Or click the "Use Demo" button on the login screen).*

---

## 🧪 Automated Testing
Run the comprehensive 17-step end-to-end integration test suite:
```bash
npm test
# Or from backend:
cd backend && npm test
```
