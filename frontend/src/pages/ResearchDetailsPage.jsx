import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { useResearch } from '../context/ResearchContext.jsx';
import { StageTracker } from '../components/common/StageTracker.jsx';
import { SafetyScoreGauge } from '../components/common/SafetyScoreGauge.jsx';
import { RiskBadge } from '../components/common/RiskBadge.jsx';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters.js';
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Bot,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  GitCompare,
} from 'lucide-react';

export const ResearchDetailsPage = () => {
  const { id } = useParams();
  const { setCurrentReport } = useResearch();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const data = await researchService.getById(id);
      setReport(data);
      setCurrentReport(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch research report');
    } finally {
      if (!isPolling) setLoading(false);
      setRefreshing(false);
    }
  }, [id, setCurrentReport]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Polling for stage progress if report is still processing
  useEffect(() => {
    if (!report || report.status === 'COMPLETED' || report.status === 'FAILED') return;

    const interval = setInterval(() => {
      fetchReport(true);
    }, 1500);

    return () => clearInterval(interval);
  }, [report, fetchReport]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm text-slate-400 font-mono">Loading corporate due diligence dossier...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="panel-card p-8 border-rose-500/30 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Report Not Found</h3>
        <p className="text-xs text-slate-400">{error || 'Unable to retrieve the specified report.'}</p>
        <Link to="/dashboard" className="inline-block bg-brand-600 hover:bg-brand-500 text-white text-xs px-4 py-2 rounded-lg">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const v = report.snapshotData?.verification || {};
  const f = report.snapshotData?.financials || {};
  const c = report.snapshotData?.company || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="panel-card p-6 border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {report.companyName}
              </h1>
              {report.ticker && (
                <span className="font-mono text-xs bg-brand-500/10 text-brand-300 border border-brand-500/20 px-2.5 py-1 rounded-md font-bold">
                  {report.ticker}
                </span>
              )}
              <RiskBadge level={report.overallRiskLevel} />
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {c.sector || 'Commercial Enterprise'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {c.country || 'Global Entity'}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Audited: {formatDate(report.createdAt)}
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/assistant"
              className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </Link>
            <Link
              to={`/verification?researchId=${report._id}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Physical Verification</span>
            </Link>
            <Link
              to={`/financials?researchId=${report._id}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
              <span>Financials</span>
            </Link>
            <Link
              to={`/risks?researchId=${report._id}`}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Risk Matrix</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time 8-Stage Progress Tracker */}
      <StageTracker
        currentStage={report.currentStage}
        stageProgress={report.stageProgress}
        status={report.status}
        stageLogs={report.stageLogs}
      />

      {/* Safety Score & Legitimacy Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="panel-card p-6 border-slate-800 flex items-center justify-center">
          <SafetyScoreGauge score={report.overallSafetyScore} label="INVESTMENT SAFETY SCORE" size={140} />
        </div>

        <div className="panel-card p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">Physical Footprint</span>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">
              {report.legitimacyScore}<span className="text-slate-500 text-base font-normal">/100</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Google Maps verified location:{' '}
              <span className="text-slate-200 font-medium">{v.locationType || 'Commercial Site'}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            {v.isVirtualOffice ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Virtual Coworking Mailbox Detected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dedicated Physical Operations Verified
              </span>
            )}
          </div>
        </div>

        <div className="panel-card p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">Financial Solvency</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {f.solvencyRating || 'SOUND'}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Revenue: <span className="text-slate-200 font-mono">{formatCurrency(f.revenue)}</span> • Net Margin:{' '}
              <span className="text-slate-200 font-mono">{formatPercent(f.profitMargin)}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>D/E: {f.debtToEquity || 'N/A'}</span>
            <span>Current: {f.currentRatio || 'N/A'}</span>
            <span>P/E: {f.peRatio || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* AI Executive Summary Box */}
      <div className="panel-card p-6 sm:p-8 border-slate-800">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-800">
          <Brain className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            AI Research Synthesis & Due Diligence Verdict
          </h3>
        </div>
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
          {report.aiExecutiveSummary || 'Synthesizing verified dossier records...'}
        </div>
      </div>

      {/* 5 Risk Vector Breakdown */}
      {report.riskBreakdown && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            5-Vector Risk Assessment Matrix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(report.riskBreakdown).map(([key, vector]) => (
              <div key={key} className="panel-card p-4 border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    {key.replace('Risk', '')}
                  </span>
                  <RiskBadge level={vector.level} size="sm" />
                </div>
                <div className="text-xl font-bold font-mono text-white mt-2">
                  {vector.score}<span className="text-slate-500 text-xs">/100</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-3">
                  {vector.analysis}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags & Positive Indicators Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Red Flags */}
        <div className="panel-card p-6 border-slate-800">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800 text-rose-400 font-semibold text-sm font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Red Flags ({report.redFlags?.length || 0})</span>
          </div>
          <div className="space-y-3">
            {report.redFlags?.length > 0 ? (
              report.redFlags.map((rf, idx) => (
                <div key={idx} className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-300">{rf.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                      {rf.severity}
                    </span>
                  </div>
                  <p className="text-slate-300">{rf.description}</p>
                  <span className="text-[10px] text-slate-500 block font-mono">Source: {rf.source}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center">No high-severity red flags identified.</div>
            )}
          </div>
        </div>

        {/* Positive Indicators */}
        <div className="panel-card p-6 border-slate-800">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800 text-emerald-400 font-semibold text-sm font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Positive Indicators ({report.positiveIndicators?.length || 0})</span>
          </div>
          <div className="space-y-3">
            {report.positiveIndicators?.length > 0 ? (
              report.positiveIndicators.map((pi, idx) => (
                <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-300">{pi.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                      {pi.impact} IMPACT
                    </span>
                  </div>
                  <p className="text-slate-300">{pi.description}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center">No distinct positive moats cataloged.</div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Citations */}
      {report.evidenceCitations?.length > 0 && (
        <div className="panel-card p-6 border-slate-800">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4">
            Audited Evidence Citations & Public Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {report.evidenceCitations.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1">
                <span className="text-[10px] font-mono text-brand-400 uppercase">{item.type}</span>
                <div className="font-semibold text-slate-200">{item.title}</div>
                <p className="text-slate-400 text-[11px] line-clamp-3">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

