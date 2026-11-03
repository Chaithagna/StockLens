import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { RiskBadge } from '../components/common/RiskBadge.jsx';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import {
  GitCompare,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const CompanyComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const [historyReports, setHistoryReports] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    searchParams.get('ids') ? searchParams.get('ids').split(',').filter(Boolean) : []
  );

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available reports for selection
  useEffect(() => {
    researchService
      .getHistory({ limit: 50 })
      .then((res) => {
        const list = res.data || [];
        setHistoryReports(list);

        // Auto-select first two if none provided in query param
        if (selectedIds.length === 0 && list.length >= 2) {
          setSelectedIds([list[0]._id, list[1]._id]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Run comparison when selectedIds change
  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);
      setError('');
      researchService
        .compare(selectedIds)
        .then((res) => {
          setComparisonData(res);
        })
        .catch((err) => {
          setError(err.message || 'Comparison failed');
        })
        .finally(() => setLoading(false));
    } else {
      setComparisonData(null);
    }
  }, [selectedIds]);

  const handleToggleId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert('You can compare a maximum of 4 companies at once.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-brand-400" />
            <span>Side-by-Side Company Due Diligence Comparison</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate multiple entities simultaneously across physical legitimacy, balance sheet solvency, and red flag density.
          </p>
        </div>
      </div>

      {/* Report Selection Drawer */}
      <div className="panel-card p-5 border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400 mb-3">
          Select Companies to Compare (Choose 2 to 4)
        </h3>

        <div className="flex flex-wrap gap-2">
          {historyReports.map((r) => {
            const isSelected = selectedIds.includes(r._id);
            return (
              <button
                key={r._id}
                type="button"
                onClick={() => handleToggleId(r._id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{r.companyName}</span>
                {r.ticker && <span className="font-mono text-[10px] opacity-80">({r.ticker})</span>}
                <RiskBadge level={r.overallRiskLevel} size="sm" />
              </button>
            );
          })}

          {historyReports.length === 0 && (
            <div className="text-xs text-slate-500 py-2">
              No historical reports available yet. Conduct research on companies first.
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Analyzing and cross-referencing metrics...</p>
        </div>
      )}

      {/* Comparative AI Verdict Banner */}
      {comparisonData?.verdict && !loading && (
        <div className="p-6 bg-gradient-to-r from-brand-950/50 via-slate-900 to-indigo-950/50 border border-brand-500/30 rounded-2xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-brand-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Comparative Synthesis
            </span>
            <p className="mt-1 text-sm font-semibold text-white leading-relaxed">
              {comparisonData.verdict}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {comparisonData?.comparison && !loading && (
        <div className="panel-card p-6 border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="pb-4 w-48">Metric / Dimension</th>
                {comparisonData.comparison.map((item) => (
                  <th key={item.id} className="pb-4 font-bold text-white text-sm">
                    {item.companyName}
                    <span className="block text-[11px] font-mono text-slate-400 font-normal">
                      {item.ticker !== 'N/A' ? item.ticker : 'Private'} • {item.sector}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* Safety Score */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Investment Safety Score</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-base font-bold text-white">
                    {item.overallSafetyScore}/100
                  </td>
                ))}
              </tr>

              {/* Risk Level */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Risk Classification</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5">
                    <RiskBadge level={item.overallRiskLevel} size="sm" />
                  </td>
                ))}
              </tr>

              {/* Physical Legitimacy */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Physical Legitimacy Score</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-slate-200">
                    {item.legitimacyScore}/100
                  </td>
                ))}
              </tr>

              {/* Office Type */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Location Classification</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-slate-300 font-sans">
                    {item.locationType}
                    {item.isVirtualOffice && (
                      <span className="block text-[10px] text-rose-400 font-mono">
                        ⚠️ Virtual Office ({item.virtualOfficeProvider})
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Solvency Status */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Solvency Rating</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 font-bold text-emerald-400">
                    {item.solvencyRating}
                  </td>
                ))}
              </tr>

              {/* Revenue */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Annual Revenue</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-slate-200">
                    {formatCurrency(item.revenue)}
                  </td>
                ))}
              </tr>

              {/* Net Profit Margin */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Net Profit Margin</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-slate-200">
                    {formatPercent(item.profitMargin)}
                  </td>
                ))}
              </tr>

              {/* Debt to Equity */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Debt-to-Equity</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-slate-200">
                    {item.debtToEquity}
                  </td>
                ))}
              </tr>

              {/* Current Ratio */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Current Ratio</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-slate-200">
                    {item.currentRatio}
                  </td>
                ))}
              </tr>

              {/* Red Flags Count */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 font-sans font-semibold text-slate-300">Identified Red Flags</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 font-bold text-rose-400">
                    {item.redFlagsCount} flags
                  </td>
                ))}
              </tr>

              {/* View Full Link */}
              <tr>
                <td className="py-3.5 font-sans font-semibold text-slate-300">Dossier Link</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5">
                    <Link
                      to={`/research/${item.id}`}
                      className="text-brand-400 hover:text-brand-300 underline font-sans font-semibold"
                    >
                      View Report
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

