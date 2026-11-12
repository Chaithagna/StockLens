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
  Loader2,
} from 'lucide-react';

export const ResearchDetailsPage = () => {
  const { id } = useParams();
  const { setCurrentReport } = useResearch();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
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
        <Loader2 className="w-8 h-8 animate-spin text-[#315CF5]" />
        <p className="text-xs text-[#68758A] font-mono">Loading corporate due diligence dossier...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="panel-card p-8 border-[#E05252]/30 text-center space-y-4 max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-[#E05252] mx-auto" />
        <h3 className="text-lg font-bold text-[#172033]">Report Not Found</h3>
        <p className="text-xs text-[#68758A]">{error || 'Unable to retrieve the specified report.'}</p>
        <Link to="/dashboard" className="btn-primary text-xs">
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
      <div className="panel-card p-6 bg-white border-[#E6EAF0]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                {report.companyName}
              </h1>
              {report.ticker && (
                <span className="font-mono text-xs bg-[#315CF5]/10 text-[#315CF5] border border-[#315CF5]/20 px-2.5 py-1 rounded-md font-bold">
                  {report.ticker}
                </span>
              )}
              <RiskBadge level={report.overallRiskLevel} />
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#68758A]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#9AA5B6]" />
                {c.sector || 'Commercial Enterprise'}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9AA5B6]" />
                {c.country || 'Global Entity'}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#9AA5B6]" />
                Audited: {formatDate(report.createdAt)}
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/assistant?researchId=${report._id}`}
              className="btn-primary text-xs"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </Link>
            <Link
              to={`/verification?researchId=${report._id}`}
              className="btn-secondary text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A6A0]" />
              <span>Physical Verification</span>
            </Link>
            <Link
              to={`/financials?researchId=${report._id}`}
              className="btn-secondary text-xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#315CF5]" />
              <span>Financials</span>
            </Link>
            <Link
              to={`/risks?researchId=${report._id}`}
              className="btn-secondary text-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#E9A23B]" />
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
        <div className="panel-card p-6 flex items-center justify-center">
          <SafetyScoreGauge score={report.overallSafetyScore} label="INVESTMENT SAFETY SCORE" size={140} />
        </div>

        <div className="panel-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-[#68758A]">Physical Footprint</span>
            <div className="text-3xl font-extrabold text-[#172033] font-mono mt-1">
              {report.legitimacyScore}<span className="text-[#68758A] text-base font-normal">/100</span>
            </div>
            <p className="text-xs text-[#68758A] mt-2">
              Google Maps verified location:{' '}
              <span className="text-[#172033] font-semibold">{v.locationType || 'Commercial Site'}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6EAF0]">
            {v.isVirtualOffice ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#E05252] bg-[#E05252]/10 px-2.5 py-1 rounded-md border border-[#E05252]/20 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Virtual Coworking Mailbox Detected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#159B70] bg-[#159B70]/10 px-2.5 py-1 rounded-md border border-[#159B70]/20 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dedicated Physical Presence Verified
              </span>
            )}
          </div>
        </div>

        <div className="panel-card p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase font-bold text-[#68758A]">Financial Solvency</span>
            <div className="text-2xl font-extrabold text-[#159B70] font-mono mt-1">
              {f.solvencyRating || 'SOUND'}
            </div>
            <p className="text-xs text-[#68758A] mt-2">
              Revenue: <span className="text-[#172033] font-mono font-medium">{formatCurrency(f.revenue)}</span> • Net Margin:{' '}
              <span className="text-[#172033] font-mono font-medium">{formatPercent(f.profitMargin)}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E6EAF0] text-xs font-mono text-[#68758A] flex items-center justify-between">
            <span>D/E: {f.debtToEquity || 'N/A'}</span>
            <span>Current: {f.currentRatio || 'N/A'}</span>
            <span>P/E: {f.peRatio || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* AI Executive Summary Box */}
      <div className="panel-card p-6 sm:p-8">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E6EAF0]">
          <Brain className="w-5 h-5 text-[#315CF5]" />
          <h3 className="text-base font-bold text-[#172033] tracking-tight">
            AI Research Synthesis & Due Diligence Verdict
          </h3>
        </div>
        <div className="text-xs sm:text-sm text-[#172033] leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {report.aiExecutiveSummary || 'Synthesizing verified dossier records...'}
        </div>
      </div>

      {/* 5 Risk Vector Breakdown */}
      {report.riskBreakdown && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#68758A] uppercase tracking-wider font-mono">
            5-Vector Risk Assessment Matrix
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(report.riskBreakdown).map(([key, vector]) => (
              <div key={key} className="panel-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#68758A]">
                    {key.replace('Risk', '')}
                  </span>
                  <RiskBadge level={vector.level} size="sm" />
                </div>
                <div className="text-xl font-bold font-mono text-[#172033] mt-2">
                  {vector.score}<span className="text-[#68758A] text-xs font-normal">/100</span>
                </div>
                <p className="text-[11px] text-[#68758A] mt-2 line-clamp-3 leading-relaxed">
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
        <div className="panel-card p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E6EAF0] text-[#E05252] font-bold text-sm font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Red Flags ({report.redFlags?.length || 0})</span>
          </div>
          <div className="space-y-3">
            {report.redFlags?.length > 0 ? (
              report.redFlags.map((rf, idx) => (
                <div key={idx} className="p-3.5 bg-[#E05252]/5 border border-[#E05252]/20 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#E05252]">{rf.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-[#E05252]/15 text-[#E05252] px-1.5 py-0.5 rounded font-bold">
                      {rf.severity}
                    </span>
                  </div>
                  <p className="text-[#172033] leading-relaxed">{rf.description}</p>
                  <span className="text-[10px] text-[#68758A] block font-mono">Source: {rf.source}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#68758A] py-4 text-center">No high-severity red flags identified.</div>
            )}
          </div>
        </div>

        {/* Positive Indicators */}
        <div className="panel-card p-6">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#E6EAF0] text-[#159B70] font-bold text-sm font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Positive Indicators ({report.positiveIndicators?.length || 0})</span>
          </div>
          <div className="space-y-3">
            {report.positiveIndicators?.length > 0 ? (
              report.positiveIndicators.map((pi, idx) => (
                <div key={idx} className="p-3.5 bg-[#159B70]/5 border border-[#159B70]/20 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#159B70]">{pi.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-[#159B70]/15 text-[#159B70] px-1.5 py-0.5 rounded font-bold">
                      {pi.impact} IMPACT
                    </span>
                  </div>
                  <p className="text-[#172033] leading-relaxed">{pi.description}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#68758A] py-4 text-center">No distinct positive moats cataloged.</div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Citations */}
      {report.evidenceCitations?.length > 0 && (
        <div className="panel-card p-6">
          <h3 className="text-xs font-bold text-[#68758A] uppercase tracking-wider font-mono mb-4">
            Audited Evidence Citations & Public Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {report.evidenceCitations.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-[#F7F9FC] border border-[#E6EAF0] rounded-xl text-xs space-y-1">
                <span className="text-[10px] font-mono text-[#315CF5] uppercase font-bold">{item.type}</span>
                <div className="font-bold text-[#172033]">{item.title}</div>
                <p className="text-[#68758A] text-[11px] line-clamp-3 leading-relaxed">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
