import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { useResearch } from '../context/ResearchContext.jsx';
import {
  MapPin,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building,
  CheckCircle,
  ExternalLink,
  Globe,
  Loader2,
  FileCheck,
} from 'lucide-react';

export const LegitimacyVerificationPage = () => {
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
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
        <p className="text-xs text-slate-400 font-mono mt-3">Loading physical verification records...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="panel-card p-8 text-center max-w-md mx-auto space-y-4">
        <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Active Research Selected</h3>
        <p className="text-xs text-slate-400">
          Select or initiate a company due diligence audit to inspect its physical location records.
        </p>
        <Link to="/search" className="inline-block bg-brand-600 text-white text-xs px-4 py-2 rounded-lg">
          Search Companies
        </Link>
      </div>
    );
  }

  const v = report.snapshotData?.verification || {};
  const c = report.snapshotData?.company || {};

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Company Legitimacy & Physical Presence
            </h1>
            <span className="text-xs font-mono bg-brand-500/10 text-brand-400 px-2.5 py-0.5 rounded border border-brand-500/20">
              MODULE 1
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cross-referencing registered addresses with Google Maps Places, satellite verification, and shell maildrop registries for{' '}
            <span className="text-white font-semibold">{report.companyName}</span>.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono uppercase text-slate-400">Legitimacy Score</span>
          <div className="text-2xl font-extrabold text-white font-mono">{report.legitimacyScore}/100</div>
        </div>
      </div>

      {/* Virtual Office Alert Banner if Flagged */}
      {v.isVirtualOffice && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start gap-3 text-rose-300 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm text-rose-200">High Risk Shell Entity Indicator Detected</span>
            <p className="mt-1 leading-relaxed">
              The registered corporate headquarters matches a known coworking maildrop facility ({v.virtualOfficeProvider || 'Shared Office Provider'}). 
              Virtual maildrops allow entities to claim commercial presence without dedicated operating staff or infrastructure.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Google Maps View & Verification Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Maps / Geospatial Panel */}
        <div className="panel-card p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Google Maps Location Footprint</span>
            </h3>

            {/* Embedded Google Map */}
            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative mb-4">
              {v.mapEmbedUrl ? (
                <iframe
                  title="Company Location Map"
                  src={v.mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <MapPin className="w-8 h-8 text-slate-600 mb-2" />
                  <span className="text-xs text-slate-400">Geospatial coordinates mapped</span>
                  <span className="font-mono text-xs text-brand-400 mt-1">{v.formattedAddress}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Formatted Address</span>
                <span className="font-semibold text-white text-right max-w-xs truncate">{v.formattedAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Facility Classification</span>
                <span className="font-semibold text-white">{v.locationType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Operating Status</span>
                <span className="font-mono text-emerald-400">{v.businessStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Public Reviews & Rating</span>
                <span className="font-mono text-slate-200">
                  {v.googleRating ? `${v.googleRating} ★ (${v.userRatingsTotal} reviews)` : 'Commercial Hub'}
                </span>
              </div>
            </div>
          </div>

          {v.streetViewImageUrl && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">Street View Verification Snapshot</span>
              <img
                src={v.streetViewImageUrl}
                alt="Headquarters street view"
                className="w-full h-32 object-cover rounded-lg border border-slate-800"
              />
            </div>
          )}
        </div>

        {/* Verification Findings & Evidence Checklist */}
        <div className="panel-card p-6 border-slate-800 space-y-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Due Diligence Findings & Checklist</span>
          </h3>

          <div className="space-y-3">
            {v.findings && v.findings.length > 0 ? (
              v.findings.map((finding, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    finding.type === 'POSITIVE'
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : finding.type === 'WARNING'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 flex items-center gap-1.5">
                      {finding.type === 'POSITIVE' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      {finding.type === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {finding.type === 'CRITICAL' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                      {finding.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {finding.type}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{finding.description}</p>
                  {finding.evidence && (
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      Evidence: {finding.evidence}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-6 text-center">
                Standard registry checks verified.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

