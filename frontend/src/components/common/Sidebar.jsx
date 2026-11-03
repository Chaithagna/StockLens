import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  History,
  GitCompare,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Bot,
  Settings,
  HelpCircle,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext.jsx';

const NAV_ITEMS = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Company Search', to: '/search', icon: Search },
  { label: 'Research History', to: '/history', icon: History },
  { label: 'Company Comparison', to: '/compare', icon: GitCompare },
  { type: 'divider', title: 'DEEP DILIGENCE' },
  { label: 'Legitimacy Verification', to: '/verification', icon: ShieldCheck },
  { label: 'Financial Analysis', to: '/financials', icon: TrendingUp },
  { label: 'Risk Assessment', to: '/risks', icon: AlertTriangle },
  { label: 'AI Assistant', to: '/assistant', icon: Bot, badge: 'PRO' },
  { type: 'divider', title: 'ACCOUNT' },
  { label: 'Settings & API Keys', to: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { currentReport } = useResearch();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">StockLens</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Active research report context pill */}
          {currentReport && (
            <div className="mb-4 p-3 bg-brand-950/40 border border-brand-500/30 rounded-xl">
              <div className="flex items-center justify-between text-[11px] font-mono text-brand-300 uppercase tracking-wider mb-1">
                <span>Active Research</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="font-bold text-sm text-white truncate">
                {currentReport.companyName}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                <span className="font-mono">{currentReport.ticker || 'PRIVATE'}</span>
                <NavLink
                  to={`/research/${currentReport._id}`}
                  className="text-brand-400 hover:underline flex items-center gap-1"
                >
                  View Report <ExternalLink className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          )}

          {NAV_ITEMS.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div
                  key={idx}
                  className="pt-4 pb-1 px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold"
                >
                  {item.title}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600/10 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono bg-brand-500/20 text-brand-300 px-1.5 py-0.2 rounded border border-brand-500/30 font-semibold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> API Online
            </span>
            <span className="font-mono text-[11px] text-slate-400">v1.0.0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            StockLens AI Researcher. Strictly for due diligence; not financial advice.
          </p>
        </div>
      </aside>
    </>
  );
};

