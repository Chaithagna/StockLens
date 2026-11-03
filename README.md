# StockLens — AI Investment Researcher
### Institutional-Grade Due Diligence & Corporate Legitimacy Platform

StockLens is a full-stack AI-powered investment research platform designed to automate and deepen due diligence on corporate entities. Traditional investment terminals focus predominantly on stock price metrics and standardized earnings calls. StockLens centralizes forensic due diligence across three critical pillars:

1. **Physical Location Verification**: Querying Google Maps Places and Street View to verify genuine commercial footprint versus virtual offices or coworking maildrop shells (e.g., Regus, WeWork).
2. **Financial Solvency Diagnostics**: Multi-year audits of balance sheets, revenue/profit trajectories, Debt-to-Equity, and Current Ratios.
3. **Forensic News & Regulatory Scans**: Aggregating public regulatory enforcement actions (SEC filings, court disputes, and governance shifts) into an overall **Investment Safety Score (0–100)**.

---

## 🚀 Key Features & 13 Specialized Modules

- **User Dashboard**: Live diligence counts (Low, Moderate, High, Critical), Recharts risk distribution charts, quick company search, and recent activity streams.
- **Company Search & Disambiguation**: Autocomplete entity matching, alias identification, and test shell company profiles.
- **8-Stage Asynchronous Pipeline**: Real-time progress tracker reflecting backend pipeline execution without fabricated states.
- **Legitimacy Verification**: Physical address analysis, Google Maps embed, street view verification, virtual office detection, and registry status.
- **Financial Analysis**: Interactive Recharts multi-year revenue and net income bars, solvency health rating, and liquidity ratios.
- **Multi-Vector Risk Assessment**: 5-dimension risk scoring (Financial, Business, Regulatory, Governance, Legitimacy) with granular red flag categorization.
- **Research Archive & History**: Private historical report snapshots, risk filtering, and longitudinal tracking.
- **Side-by-Side Comparison**: Multi-company comparative matrix highlighting safety scores, solvency ratings, and red flag differentials.
- **AI Research Assistant**: Contextual Q&A grounded strictly in report evidence with cited sources and prompt injection defense.
- **User Settings & Custom Keys**: Configure custom API keys (Google Maps, Finnhub, Tavily, Gemini, OpenAI) with zero-config server fallbacks.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite build tool)
- **Language**: JavaScript (ES Modules)
- **Styling**: Tailwind CSS (Dark financial terminal aesthetic)
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
│   │   ├── config/             # MongoDB connection with local mongod auto-spawn
│   │   ├── models/             # Mongoose schemas (User, Company, ResearchReport, etc.)
│   │   ├── controllers/        # Request handlers (Auth, Research, Verification, etc.)
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
│   │   ├── components/         # Common UI: Navbar, Sidebar, StatCard, RiskBadge, StageTracker
│   │   ├── context/            # AuthContext, ResearchContext
│   │   ├── layouts/            # DashboardLayout, AuthLayout
│   │   ├── pages/              # 13 dedicated pages matching SRS
│   │   ├── services/           # Centralized Axios API instances
│   │   ├── utils/              # Number, currency, and date formatters
│   │   ├── App.jsx             # React Router routing configuration
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
Clone the repository and install all dependencies:
```bash
# Install root, backend, and frontend packages
npm run install:all
```

### 2. Environment Configuration
The backend comes pre-configured with working defaults in `backend/.env`.
```bash
cp backend/.env.example backend/.env
```

Configuration variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/stocklens
JWT_SECRET=stocklens_super_secret_jwt_key_investment_research_2026_dev
JWT_EXPIRES_IN=7d

# Optional External API Keys (Intelligent heuristic engines active when blank)
GOOGLE_MAPS_API_KEY=
FINNHUB_API_KEY=
TAVILY_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 3. Launching the Backend Server
```bash
npm run start:backend
# Or from backend directory:
cd backend && npm run dev
```
*The server will start on `http://localhost:5000` and automatically seed the demo account.*

### 4. Launching the Frontend Application
In a separate terminal:
```bash
npm run start:frontend
# Or from frontend directory:
cd frontend && npm run dev
```
*Open `http://localhost:5173` in your browser.*

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

### Test Coverage Highlights:
- ✅ Health endpoint verification
- ✅ User registration & password hashing with bcrypt
- ✅ User authentication and JWT generation
- ✅ JWT route protection & 401 unauthorized rejection
- ✅ Autocomplete company search
- ✅ 8-stage asynchronous research pipeline execution & polling
- ✅ Google Maps physical location verification & virtual office detection
- ✅ Audited financial statement extraction & solvency calculation
- ✅ Multi-company comparison matrix & AI comparative winner evaluation
- ✅ Interactive AI Assistant Q&A with evidence source citations
- ✅ Prompt injection & jailbreak defense
- ✅ Multi-tenant user data isolation & report deletion

---

## 🛡️ Security Architecture
- **JWT Authentication**: Secured tokens with 7-day expiration.
- **Strict Data Isolation**: Every research report, conversation message, and setting is strictly scoped to `req.user._id`.
- **Input Sanitization**: XSS defense and prompt injection filters protecting LLM endpoints from malicious overrides.
- **Rate Limiting**: IP-based rate limiting on sensitive auth endpoints and research initiation.

#   S t o c k L e n s  
 