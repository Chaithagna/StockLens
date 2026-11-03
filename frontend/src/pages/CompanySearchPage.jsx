import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { companyService } from '../services/companyService.js';
import { useResearch } from '../context/ResearchContext.jsx';
import {
  Search,
  Sparkles,
  Building,
  Globe,
  Tag,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export const CompanySearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { initiateResearch } = useResearch();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Custom modal or direct inputs
  const [companyName, setCompanyName] = useState(searchParams.get('q') || '');
  const [ticker, setTicker] = useState('');
  const [domain, setDomain] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch search suggestions on query change
  useEffect(() => {
    let active = true;
    const fetchMatches = async () => {
      setLoadingSuggestions(true);
      try {
        const list = await companyService.search(query);
        if (active) setSuggestions(list);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchMatches, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelectSuggestion = (item) => {
    setCompanyName(item.name);
    setTicker(item.ticker || '');
    setDomain(item.domain || '');
  };

  const handleInitiate = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Please provide a company name');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const report = await initiateResearch(companyName.trim(), ticker.trim(), domain.trim());
      navigate(`/research/${report._id}`);
    } catch (err) {
      setError(err.message || 'Failed to start research');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Company Due Diligence Investigation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search legal entities, disambiguate corporate subsidiaries, and launch multi-vector verification.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Search & Initiation Card */}
      <div className="panel-card p-6 sm:p-8 border-slate-800">
        <form onSubmit={handleInitiate} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
              Company Name or Entity Legal Name *
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setQuery(e.target.value);
                }}
                placeholder="e.g. Apple Inc., Tesla, Alphabet, or a suspect entity..."
                className="w-full glass-input pl-10 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
                Stock Ticker Symbol (Optional)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="e.g. AAPL, TSLA, NVDA"
                  className="w-full glass-input pl-10 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
                Official Web Domain (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. apple.com, tesla.com"
                  className="w-full glass-input pl-10"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching 8-Stage Research Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Initiate Deep Due Diligence Report</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Suggested Entities / Search Matches */}
      <div>
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-3 flex items-center justify-between">
          <span>Entity Suggestions & Test Cases</span>
          {loadingSuggestions && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((item, idx) => {
            const isSuspicious = item.ticker === 'SHEL-SHELL' || item.name.includes('Virtual Office');
            return (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(item)}
                className={`panel-card p-4 border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group ${
                  isSuspicious ? 'bg-amber-950/20 border-amber-500/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                        {item.name}
                      </span>
                      {item.ticker && (
                        <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                          {item.ticker}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block mt-1">{item.sector}</span>
                    <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{item.country}</span>
                  </div>

                  {isSuspicious ? (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Shell Test
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

