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
    <div className="panel-card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-[#E6EAF0] gap-3">
        <div>
          <h3 className="text-base font-bold text-[#172033] flex items-center gap-2">
            <span>Research Verification Pipeline</span>
            {status !== 'COMPLETED' && status !== 'FAILED' && (
              <span className="flex items-center gap-1.5 text-xs text-[#315CF5] bg-[#315CF5]/10 px-2.5 py-0.5 rounded-full border border-[#315CF5]/20 font-medium">
                <Loader2 className="w-3 h-3 animate-spin" /> In Progress
              </span>
            )}
            {status === 'COMPLETED' && (
              <span className="flex items-center gap-1.5 text-xs text-[#159B70] bg-[#159B70]/10 px-2.5 py-0.5 rounded-full border border-[#159B70]/20 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
            {status === 'FAILED' && (
              <span className="flex items-center gap-1.5 text-xs text-[#E05252] bg-[#E05252]/10 px-2.5 py-0.5 rounded-full border border-[#E05252]/20 font-medium">
                <AlertTriangle className="w-3 h-3" /> Failed
              </span>
            )}
          </h3>
          <p className="text-xs text-[#68758A] mt-1">
            Real-time multi-stage due diligence execution across physical, financial, and regulatory records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-[#68758A] uppercase font-mono tracking-wider">Progress</span>
            <div className="text-lg font-bold text-[#172033] font-mono">{stageProgress}%</div>
          </div>
          <div className="w-32 bg-[#E6EAF0] rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === 'COMPLETED' ? 'bg-[#159B70]' : 'bg-[#315CF5]'
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
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                isDone
                  ? 'bg-[#159B70]/5 border-[#159B70]/25 text-[#159B70]'
                  : isCurrent
                  ? 'bg-[#315CF5]/5 border-[#315CF5]/30 text-[#315CF5] shadow-xs'
                  : 'bg-[#F7F9FC] border-[#E6EAF0] text-[#68758A]'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                  isDone
                    ? 'bg-[#159B70] text-white'
                    : isCurrent
                    ? 'bg-[#315CF5] text-white'
                    : 'bg-[#E6EAF0] text-[#68758A]'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : s.id}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 opacity-90 shrink-0" />
                  <span className="text-xs font-semibold truncate text-[#172033]">
                    {s.name}
                  </span>
                </div>
                <p className="text-[11px] text-[#68758A] mt-0.5 truncate">
                  {isDone ? 'Verified & Completed' : isCurrent ? 'Active investigation...' : 'Awaiting queue'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity Log Stream */}
      {stageLogs && stageLogs.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#E6EAF0]">
          <span className="text-[11px] font-bold text-[#68758A] uppercase tracking-wider block mb-2 font-mono">
            Pipeline Execution Stream
          </span>
          <div className="bg-[#F7F9FC] border border-[#E6EAF0] rounded-lg p-3 max-h-36 overflow-y-auto font-mono text-xs space-y-1.5">
            {stageLogs.slice().reverse().map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[#172033]">
                <span className="text-[#68758A] shrink-0 font-medium">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className={log.status === 'completed' ? 'text-[#159B70] font-medium' : log.status === 'failed' ? 'text-[#E05252] font-medium' : 'text-[#315CF5] font-medium'}>
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
