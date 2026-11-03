import React from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Globe,
  Building,
  TrendingUp,
  FileSearch,
  Brain,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';

const STAGES = [
  { id: 1, name: 'Company Identification', icon: Building },
  { id: 2, name: 'Physical Location Verification', icon: MapPin },
  { id: 3, name: 'Online Presence Investigation', icon: Globe },
  { id: 4, name: 'Background Research', icon: FileSearch },
  { id: 5, name: 'Financial Data Collection', icon: TrendingUp },
  { id: 6, name: 'News & Regulatory Scan', icon: Clock },
  { id: 7, name: 'AI Risk Analysis', icon: Brain },
  { id: 8, name: 'Final Report Generation', icon: FileCheck },
];

export const StageTracker = ({ currentStage = 1, stageProgress = 0, status = 'PENDING', stageLogs = [] }) => {
  return (
    <div className="panel-card p-6 border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Research Verification Pipeline</span>
            {status !== 'COMPLETED' && status !== 'FAILED' && (
              <span className="flex items-center gap-1.5 text-xs text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20 font-normal">
                <Loader2 className="w-3 h-3 animate-spin" /> In Progress
              </span>
            )}
            {status === 'COMPLETED' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-normal">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
            {status === 'FAILED' && (
              <span className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 font-normal">
                <AlertTriangle className="w-3 h-3" /> Failed
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-stage due diligence execution across physical, financial, and regulatory records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Progress</span>
            <div className="text-lg font-bold text-white font-mono">{stageProgress}%</div>
          </div>
          <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-brand-500'
              }`}
              style={{ width: `${stageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 8 stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAGES.map((s) => {
          const isDone = currentStage > s.id || status === 'COMPLETED';
          const isCurrent = currentStage === s.id && status !== 'COMPLETED' && status !== 'FAILED';
          const isPending = currentStage < s.id && status !== 'COMPLETED';
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-brand-950/30 border-brand-500/50 text-white shadow-lg shadow-brand-500/5'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : isCurrent
                    ? 'bg-brand-500 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : s.id}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-xs font-semibold truncate text-slate-200">
                    {s.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {isDone ? 'Verified & Completed' : isCurrent ? 'Active investigation...' : 'Awaiting queue'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity Log Stream */}
      {stageLogs && stageLogs.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
            Pipeline Execution Stream
          </span>
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-lg p-3 max-h-36 overflow-y-auto font-mono text-xs space-y-1.5">
            {stageLogs.slice().reverse().map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-500 shrink-0">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className={log.status === 'completed' ? 'text-emerald-400' : log.status === 'failed' ? 'text-rose-400' : 'text-brand-300'}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

