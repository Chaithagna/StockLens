import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ShieldCheck,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
      setQuickQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E6EAF0] px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-[#68758A] hover:text-[#172033] hover:bg-[#F7F9FC] lg:hidden focus:outline-none transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#315CF5] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1F47DC] transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#172033] tracking-tight">StockLens</span>
                <span className="text-[10px] font-mono uppercase bg-[#315CF5]/10 text-[#315CF5] px-1.5 py-0.5 rounded font-semibold border border-[#315CF5]/20">
                  AI DILIGENCE
                </span>
              </div>
              <span className="text-[10px] text-[#68758A] -mt-0.5 block font-medium">Investment Intelligence</span>
            </div>
          </Link>
        </div>

        {/* Center: Global Quick Search */}
        <form onSubmit={handleQuickSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Quick search company or ticker (e.g. AAPL, Tesla, Microsoft)..."
              className="w-full bg-[#F7F9FC] border border-[#E6EAF0] rounded-lg pl-10 pr-4 py-2 text-sm text-[#172033] placeholder-[#9AA5B6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#315CF5]/20 focus:border-[#315CF5] transition-all shadow-xs"
            />
          </div>
        </form>

        {/* Right: User Menu & Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="hidden sm:inline-flex items-center gap-2 bg-[#315CF5] hover:bg-[#1F47DC] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Research</span>
          </Link>

          {/* User profile menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#F7F9FC] border border-transparent hover:border-[#E6EAF0] transition-all focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#315CF5]/10 border border-[#315CF5]/20 flex items-center justify-center text-xs font-bold text-[#315CF5] font-mono">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-[#172033] truncate max-w-[120px]">
                  {user?.name || 'Investor'}
                </div>
                <div className="text-[10px] text-[#68758A] capitalize font-medium">{user?.role || 'user'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#68758A]" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E6EAF0] shadow-card z-20 py-1.5 text-sm">
                  <div className="px-4 py-2.5 border-b border-[#E6EAF0]">
                    <p className="text-xs font-bold text-[#172033]">{user?.name}</p>
                    <p className="text-[11px] text-[#68758A] truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#172033] hover:bg-[#F7F9FC] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#68758A]" />
                    <span>Profile & API Keys</span>
                  </Link>

                  <div className="border-t border-[#E6EAF0] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#E05252] hover:bg-[#E05252]/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
