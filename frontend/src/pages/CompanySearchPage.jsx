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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
          Company Due Diligence Investigation
        </h1>
        <p className="text-xs sm:text-sm text-[#68758A] mt-1">
          Search legal entities, disambiguate corporate subsidiaries, and launch multi-vector verification.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[#E05252]/10 border border-[#E05252]/20 rounded-xl text-xs text-[#E05252] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Search & Initiation Card */}
      <div className="panel-card p-6 sm:p-8">
        <form onSubmit={handleInitiate} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider font-mono mb-2">
              Company Name or Legal Entity Name *
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
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
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider font-mono mb-2">
                Stock Ticker Symbol (Optional)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
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
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider font-mono mb-2">
                Official Web Domain (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
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
            className="w-full py-3 btn-primary text-sm font-semibold !rounded-xl"
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
        <h3 className="text-xs font-bold text-[#68758A] uppercase tracking-wider font-mono mb-3 flex items-center justify-between">
          <span>Entity Suggestions & Test Cases</span>
          {loadingSuggestions && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#68758A]" />}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((item, idx) => {
            const isSuspicious = item.ticker === 'SHEL-SHELL' || item.name.includes('Virtual Office');
            return (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(item)}
                className={`panel-card p-4 hover:border-[#315CF5]/50 cursor-pointer transition-all group ${isSuspicious ? 'bg-[#E9A23B]/5 border-[#E9A23B]/30' : ''
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#172033] group-hover:text-[#315CF5] transition-colors">
                        {item.name}
                      </span>
                      {item.ticker && (
                        <span className="font-mono text-[10px] bg-[#F1F4F9] text-[#68758A] px-1.5 py-0.5 rounded border border-[#E6EAF0]">
                          {item.ticker}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#68758A] block mt-1">{item.sector}</span>
                    <span className="text-[11px] text-[#9AA5B6] font-mono mt-0.5 block">{item.country}</span>
                  </div>

                  {isSuspicious ? (
                    <span className="text-[10px] font-mono text-[#B47414] bg-[#E9A23B]/10 px-2 py-0.5 rounded border border-[#E9A23B]/20 flex items-center gap-1 font-semibold">
                      <ShieldAlert className="w-3 h-3" /> Shell Test
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4 text-[#9AA5B6] group-hover:text-[#315CF5] group-hover:translate-x-1 transition-all" />
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
