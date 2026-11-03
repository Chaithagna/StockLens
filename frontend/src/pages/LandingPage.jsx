import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  MapPin,
  TrendingUp,
  Brain,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Building2,
  FileText,
  BarChart3,
  Sparkles,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">StockLens</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">
                AI DUE DILIGENCE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-brand-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-brand-400 font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Corporate Due Diligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Uncover What Traditional Stock Screeners{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-brand-500">
              Miss.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            StockLens cross-references <span className="text-slate-200 font-medium">physical location verification</span> via Google Maps,{' '}
            <span className="text-slate-200 font-medium">audited balance sheet solvency</span>, and{' '}
            <span className="text-slate-200 font-medium">AI-synthesized public intelligence</span> to protect your capital from shell companies and hidden risks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Launch Research Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm sm:text-base px-8 py-3.5 rounded-xl transition-all"
            >
              <span>Explore Demo Account</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Terminal Preview */}
        <div className="max-w-5xl mx-auto mt-16 rounded-2xl border border-slate-800/90 bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-black/80 relative z-10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-slate-400">StockLens Intelligence Terminal</span>
            </div>
            <div className="font-mono text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
              LIVE RESEARCH DOSSIER
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="panel-card p-4 bg-slate-950/60 border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Pillar 1: Physical Verification</span>
              <div className="mt-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Dedicated HQ Verified</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Google Places & Street View confirm commercial campus. Zero virtual coworking maildrop patterns detected.
              </p>
              <div className="mt-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                Legitimacy Score: 95/100
              </div>
            </div>

            <div className="panel-card p-4 bg-slate-950/60 border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Pillar 2: Financial Solvency</span>
              <div className="mt-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-400" />
                <span className="font-bold text-white text-sm">Fortress Balance Sheet</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Audited debt-to-equity ratio of 0.38, current ratio of 1.35, and strong operating cash flows.
              </p>
              <div className="mt-3 text-xs font-mono text-brand-300 bg-brand-500/10 p-2 rounded border border-brand-500/20">
                Solvency Rating: EXCELLENT
              </div>
            </div>

            <div className="panel-card p-4 bg-slate-950/60 border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400">Pillar 3: AI Risk Synthesis</span>
              <div className="mt-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-white text-sm">5-Vector Risk Engine</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                AI cross-references regulatory warnings, litigation disclosures, and SEC records without hallucination.
              </p>
              <div className="mt-3 text-xs font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                Safety Score: 88/100 (LOW RISK)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Institutional-Grade Due Diligence for Every Investor
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              From individual retail traders to professional compliance officers, StockLens automates hours of manual verification in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="panel-card p-6 border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Physical Location Verification</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Connects to Google Maps Places and Street View API. Automatically detects virtual offices, shared coworking suites (e.g., Regus, WeWork), and flags shell entity patterns.
              </p>
            </div>

            <div className="panel-card p-6 border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Financial & Solvency Diagnostics</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Audits multi-year revenue, net income, Debt-to-Equity, and Current Ratio. Identifies high cash-burn, insolvency danger, and anomalous margin contractions.
              </p>
            </div>

            <div className="panel-card p-6 border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Interactive AI Research Assistant</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Engage in conversational follow-up questions grounded strictly in the report's evidence. Ask about red flags, verify claims, and compare longitudinal reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 bg-slate-950 text-xs text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span className="font-semibold text-slate-200">StockLens AI Investment Researcher</span>
          </div>
          <div>
            © {new Date().getFullYear()} StockLens. Strictly for due diligence and research purposes. Not financial advice.
          </div>
        </div>
      </footer>
    </div>
  );
};

