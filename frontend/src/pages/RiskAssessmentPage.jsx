import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { useResearch } from '../context/ResearchContext.jsx';
import { RiskBadge } from '../components/common/RiskBadge.jsx';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  TrendingDown,
  Layers,
  Scale,
  Building,
  Loader2,
  FileWarning,
} from 'lucide-react';

export const RiskAssessmentPage = () => {
  const [searchParams] = useSearchParams();
  const { currentReport } = useResearch();
  const researchId = searchParams.get('researchId') || currentReport?._id;

  const [report, setReport] = useState(currentReport);
  const [loading, setLoading] = useState(!currentReport);

  useEffect(() => {
    if (researchId && (!report || report._id !== researchId)) {
      setLoading(true);
      researchService
        .getById(researchId)
        .then((data) => setReport(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [researchId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#315CF5] mx-auto" />
        <p className="text-xs text-[#68758A] font-mono mt-3">Synthesizing risk assessment matrices...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="panel-card p-8 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-10 h-10 text-[#E9A23B] mx-auto" />
        <h3 className="text-base font-bold text-[#172033]">No Active Research Selected</h3>
        <p className="text-xs text-[#68758A]">
          Select a research report from your dashboard to view its risk breakdown.
        </p>
        <Link to="/dashboard" className="btn-primary text-xs">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const rb = report.riskBreakdown || {};

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6EAF0] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172033] tracking-tight">
              Multi-Dimensional Risk Matrix & Red Flags
            </h1>
            <RiskBadge level={report.overallRiskLevel} />
          </div>
          <p className="text-xs text-[#68758A] mt-1">
            Forensic risk quantification across financial, governance, operational, regulatory, and legitimacy dimensions for{' '}
            <span className="text-[#172033] font-semibold">{report.companyName}</span>.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono uppercase font-bold text-[#68758A]">Composite Safety Score</span>
          <div className="text-2xl font-extrabold text-[#172033] font-mono">{report.overallSafetyScore}/100</div>
        </div>
      </div>

      {/* 5 Risk Vector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { key: 'financialRisk', title: 'Financial Risk', icon: TrendingDown, desc: 'Solvency, leverage, and cash burn' },
          { key: 'businessRisk', title: 'Business Risk', icon: Layers, desc: 'Competitiveness, moats, and margin trends' },
          { key: 'regulatoryRisk', title: 'Regulatory Risk', icon: Scale, desc: 'Litigation, SEC disclosures, and compliance' },
          { key: 'governanceRisk', title: 'Governance Risk', icon: Building, desc: 'Management stability and leadership structure' },
          { key: 'legitimacyRisk', title: 'Legitimacy Risk', icon: ShieldAlert, desc: 'Physical footprint and shell indicators' },
        ].map((item) => {
          const vector = rb[item.key] || { score: 20, level: 'LOW', analysis: 'Standard commercial standing.' };
          const Icon = item.icon;
          return (
            <div key={item.key} className="panel-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-[#68758A]" />
                  <RiskBadge level={vector.level} size="sm" />
                </div>
                <h3 className="font-bold text-sm text-[#172033] mt-3">{item.title}</h3>
                <div className="text-2xl font-extrabold text-[#172033] font-mono mt-1">
                  {vector.score}<span className="text-[#68758A] text-xs font-normal">/100</span>
                </div>
                <p className="text-xs text-[#68758A] mt-2 leading-relaxed">{vector.analysis}</p>
              </div>

              {vector.flags?.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E6EAF0] space-y-1">
                  {vector.flags.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono block text-[#68758A] truncate">
                      • {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Red Flags Detail Section */}
      <div className="panel-card p-6">
        <h3 className="text-xs font-bold text-[#E05252] uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
          <FileWarning className="w-4 h-4" />
          <span>Detailed Red Flags & Audit Discrepancies ({report.redFlags?.length || 0})</span>
        </h3>

        <div className="space-y-3">
          {report.redFlags?.length > 0 ? (
            report.redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#E05252]/5 border border-[#E05252]/20 rounded-xl text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#E05252]">{flag.title}</span>
                    <span className="font-mono text-[10px] bg-white text-[#68758A] px-2 py-0.5 rounded border border-[#E6EAF0] font-semibold">
                      {flag.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#E05252]/15 text-[#E05252] px-2 py-0.5 rounded font-bold">
                    {flag.severity} SEVERITY
                  </span>
                </div>
                <p className="text-[#172033] leading-relaxed text-xs">{flag.description}</p>
                <span className="text-[11px] font-mono text-[#68758A] block">Identified Via: {flag.source}</span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-[#68758A]">
              No material red flags identified in this company's filings.
            </div>
          )}
        </div>
      </div>

      {/* Positive Defensive Indicators */}
      <div className="panel-card p-6">
        <h3 className="text-xs font-bold text-[#159B70] uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Positive Defensive Factors ({report.positiveIndicators?.length || 0})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {report.positiveIndicators?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#159B70]/5 border border-[#159B70]/20 rounded-xl text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#159B70]">{item.title}</span>
                <span className="text-[10px] font-mono bg-[#159B70]/15 text-[#159B70] px-1.5 py-0.5 rounded font-bold">
                  {item.impact} IMPACT
                </span>
              </div>
              <p className="text-[#172033] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
