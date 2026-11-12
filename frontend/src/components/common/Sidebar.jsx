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
          className="fixed inset-0 bg-[#172033]/20 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E6EAF0] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E6EAF0] lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#315CF5] flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-[#172033]">StockLens</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#68758A] hover:text-[#172033] rounded-lg hover:bg-[#F7F9FC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Active research report context pill */}
          {currentReport && (
            <div className="mb-4 p-3 bg-[#F0F4FE] border border-[#DBE4FD] rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#315CF5] uppercase tracking-wider mb-1 font-bold">
                <span>Active Research</span>
                <span className="w-2 h-2 rounded-full bg-[#159B70] animate-pulse" />
              </div>
              <div className="font-bold text-xs text-[#172033] truncate">
                {currentReport.companyName}
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-[#68758A]">
                <span className="font-mono font-medium">{currentReport.ticker || 'PRIVATE'}</span>
                <NavLink
                  to={`/research/${currentReport._id}`}
                  className="text-[#315CF5] hover:underline flex items-center gap-0.5 font-semibold"
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
                  className="pt-4 pb-1.5 px-3 text-[10px] font-mono uppercase tracking-widest text-[#68758A] font-bold"
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#F0F4FE] text-[#315CF5] font-semibold border border-[#DBE4FD]'
                    : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F7F9FC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#315CF5]' : 'text-[#68758A]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono bg-[#315CF5]/10 text-[#315CF5] px-1.5 py-0.2 rounded font-bold border border-[#315CF5]/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#E6EAF0] bg-white">
          <div className="flex items-center justify-between text-xs text-[#68758A]">
            <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#159B70]" /> Engine Online
            </span>
            <span className="font-mono text-[11px] text-[#68758A]">v1.0.0</span>
          </div>
          <p className="text-[10px] text-[#68758A] mt-2 leading-relaxed">
            StockLens AI Researcher. Strictly for due diligence; not financial advice.
          </p>
        </div>
      </aside>
    </>
  );
};
