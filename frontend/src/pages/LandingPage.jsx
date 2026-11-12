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
  Bot,
  Layers,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans selection:bg-[#315CF5] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-[#E6EAF0] bg-white sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#315CF5] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#172033] tracking-tight">StockLens</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase bg-[#315CF5]/10 text-[#315CF5] px-1.5 py-0.5 rounded font-bold border border-[#315CF5]/20">
                AI DUE DILIGENCE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#68758A]">
            <a href="#features" className="hover:text-[#172033] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#172033] transition-colors">How It Works</a>
            <a href="#diligence" className="hover:text-[#172033] transition-colors">Diligence Pillars</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-[#172033] hover:text-[#315CF5] px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-xs sm:text-sm !py-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white to-[#F7F9FC] border-b border-[#E6EAF0]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F4FE] border border-[#DBE4FD] text-xs text-[#315CF5] font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Corporate Diligence & Forensics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172033] tracking-tight leading-[1.15]">
            Research Smarter.{' '}
            <span className="text-[#315CF5]">
              Invest With Clarity.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#68758A] max-w-2xl mx-auto leading-relaxed">
            AI-powered company research that cross-references <span className="text-[#172033] font-semibold">Google Maps physical presence</span>,{' '}
            <span className="text-[#172033] font-semibold">audited financial solvency</span>, and{' '}
            <span className="text-[#172033] font-semibold">forensic regulatory intelligence</span> to uncover critical investment risks.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/register"
              className="w-full sm:w-auto btn-primary !py-3 !px-7 !text-sm"
            >
              <span>Start Researching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto btn-secondary !py-3 !px-7 !text-sm"
            >
              <span>Explore Platform (Demo)</span>
            </Link>
          </div>
        </div>

        {/* Elegant Light Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-14 rounded-2xl border border-[#E6EAF0] bg-white p-4 sm:p-6 shadow-subtle relative z-10">
          <div className="flex items-center justify-between border-b border-[#E6EAF0] pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E05252]" />
              <div className="w-3 h-3 rounded-full bg-[#E9A23B]" />
              <div className="w-3 h-3 rounded-full bg-[#159B70]" />
              <span className="ml-2 font-mono text-xs font-semibold text-[#68758A]">StockLens Intelligence Terminal</span>
            </div>
            <div className="font-mono text-xs font-bold text-[#16A6A0] bg-[#16A6A0]/10 px-2.5 py-0.5 rounded border border-[#16A6A0]/20">
              AUDITED DOSSIER PREVIEW
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#E6EAF0] bg-[#F7F9FC] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#68758A]">Physical Footprint Check</span>
                <div className="mt-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#159B70]" />
                  <span className="font-bold text-[#172033] text-sm">Dedicated HQ Verified</span>
                </div>
                <p className="text-xs text-[#68758A] mt-1.5 leading-relaxed">
                  Google Maps & Street View confirm commercial campus. Zero virtual coworking maildrop patterns detected.
                </p>
              </div>
              <div className="mt-3 text-xs font-mono font-semibold text-[#159B70] bg-[#159B70]/10 p-2 rounded-lg border border-[#159B70]/20">
                Legitimacy Score: 95/100
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E6EAF0] bg-[#F7F9FC] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#68758A]">Financial Solvency Audit</span>
                <div className="mt-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#315CF5]" />
                  <span className="font-bold text-[#172033] text-sm">Fortress Balance Sheet</span>
                </div>
                <p className="text-xs text-[#68758A] mt-1.5 leading-relaxed">
                  Audited Debt-to-Equity of 0.38, Current Ratio of 1.35, and strong operating cash flow buffer.
                </p>
              </div>
              <div className="mt-3 text-xs font-mono font-semibold text-[#315CF5] bg-[#315CF5]/10 p-2 rounded-lg border border-[#315CF5]/20">
                Solvency Rating: EXCELLENT
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E6EAF0] bg-[#F7F9FC] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-[#68758A]">AI Risk Synthesis</span>
                <div className="mt-2 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#16A6A0]" />
                  <span className="font-bold text-[#172033] text-sm">5-Vector Risk Engine</span>
                </div>
                <p className="text-xs text-[#68758A] mt-1.5 leading-relaxed">
                  Autonomous synthesis cross-referencing regulatory warnings, SEC filings, and litigation wire.
                </p>
              </div>
              <div className="mt-3 text-xs font-mono font-semibold text-[#159B70] bg-[#159B70]/10 p-2 rounded-lg border border-[#159B70]/20">
                Safety Score: 88/100 (LOW RISK)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label text-[#315CF5]">Complete Feature Suite</span>
          <h2 className="text-3xl font-extrabold text-[#172033] tracking-tight mt-1">
            Five Core Capabilities of StockLens
          </h2>
          <p className="text-sm text-[#68758A] mt-2">
            Built for institutional analysts, compliance officers, and discerning retail investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Google Maps Verification */}
          <div className="panel-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#16A6A0]/10 border border-[#16A6A0]/20 text-[#16A6A0] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">1. Google Maps Business Verification</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Automatically geocodes headquarters addresses, retrieves verified Google Places metadata, and detects shared coworking suites or virtual office providers (e.g., Regus, WeWork).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E6EAF0] text-[11px] font-semibold text-[#16A6A0] flex items-center gap-1">
              <span>Detects shell company mailboxes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 2: Financial Health Analysis */}
          <div className="panel-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#315CF5]/10 border border-[#315CF5]/20 text-[#315CF5] flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">2. Financial Health & Solvency Analysis</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Extracts multi-year revenues, net profits, and cash flows. Computes debt-to-equity leverage, current ratios, operating margins, and assesses corporate default risk.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E6EAF0] text-[11px] font-semibold text-[#315CF5] flex items-center gap-1">
              <span>Interactive Recharts visualizations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 3: AI-Powered Risk Assessment */}
          <div className="panel-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#E9A23B]/10 border border-[#E9A23B]/20 text-[#E9A23B] flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">3. AI-Powered Risk Assessment</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Quantifies risk across five distinct vectors: Financial, Business, Regulatory, Governance, and Legitimacy. Automatically tags red flags by severity with verified evidence sources.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E6EAF0] text-[11px] font-semibold text-[#B47414] flex items-center gap-1">
              <span>Objective 0–100 Safety Score</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 4: Company Research Reports */}
          <div className="panel-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#159B70]/10 border border-[#159B70]/20 text-[#159B70] flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">4. Immutable Research Snapshots</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Persists complete point-in-time dossiers to MongoDB. Track company changes over time, compare historical audits, and review regulatory updates with user-isolated privacy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E6EAF0] text-[11px] font-semibold text-[#159B70] flex items-center gap-1">
              <span>Longitudinal audit trails</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Feature 5: AI Research Assistant */}
          <div className="panel-card p-6 flex flex-col justify-between md:col-span-2 lg:col-span-2">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#315CF5]/10 border border-[#315CF5]/20 text-[#315CF5] flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">5. Interactive AI Research Assistant</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Engage in natural language follow-up inquiries grounded strictly in the company’s evidence. Ask about litigation disclosures, debt maturities, or verify address credibility without AI hallucination or prompt injection risk.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E6EAF0] text-[11px] font-semibold text-[#315CF5] flex items-center gap-1">
              <span>Source-cited factual answers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#E6EAF0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label text-[#315CF5]">Simple Workflow</span>
            <h2 className="text-3xl font-extrabold text-[#172033] tracking-tight mt-1">
              Three Steps to Comprehensive Due Diligence
            </h2>
            <p className="text-sm text-[#68758A] mt-2">
              Transform hours of fragmented manual investigation into an automated 30-second workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-[#F7F9FC] border border-[#E6EAF0]">
              <div className="w-12 h-12 rounded-full bg-[#315CF5] text-white font-mono font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-[#172033]">Search & Identify Entity</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Enter any public ticker or private entity name. StockLens disambiguates legal corporate profiles and identifies the official corporate domain.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-[#F7F9FC] border border-[#E6EAF0]">
              <div className="w-12 h-12 rounded-full bg-[#16A6A0] text-white font-mono font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-[#172033]">Multi-Pillar Deep Audit</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Our 8-stage asynchronous engine queries Google Maps Places, extracts balance sheet filings, checks news wires, and executes the 5-vector risk matrix.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-[#F7F9FC] border border-[#E6EAF0]">
              <div className="w-12 h-12 rounded-full bg-[#159B70] text-white font-mono font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-[#172033]">Actionable Report & AI Q&A</h3>
              <p className="mt-2 text-xs text-[#68758A] leading-relaxed">
                Review your Investment Safety Score, examine categorized red flags, verify physical presence, and drill down with the interactive AI Assistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F0F4FE] border-b border-[#DBE4FD]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#172033] tracking-tight">
            Ready to Verify Your Next Investment?
          </h2>
          <p className="mt-3 text-sm text-[#68758A] max-w-xl mx-auto">
            Access institutional-grade corporate due diligence in seconds. Sign in with our pre-seeded demo account or register for free.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary !py-3 !px-6">
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary !py-3 !px-6">
              <span>Sign In with Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="mt-auto py-10 bg-white text-xs text-[#68758A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#315CF5]" />
            <span className="font-bold text-[#172033]">StockLens — AI Investment Researcher</span>
          </div>
          <div className="text-center sm:text-right text-[11px] leading-relaxed">
            © {new Date().getFullYear()} StockLens Inc. For diligence and intelligence purposes only. Not financial advice.
          </div>
        </div>
      </footer>
    </div>
  );
};
