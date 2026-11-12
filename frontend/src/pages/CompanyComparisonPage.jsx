import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { RiskBadge } from '../components/common/RiskBadge.jsx';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import {
  GitCompare,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6EAF0] gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-[#315CF5]" />
            <span>Side-by-Side Company Due Diligence Comparison</span>
          </h1>
          <p className="text-xs text-[#68758A] mt-1">
            Evaluate multiple entities simultaneously across physical legitimacy, balance sheet solvency, and red flag density.
          </p>
        </div>
      </div>

      {/* Report Selection Drawer */}
      <div className="panel-card p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#68758A] mb-3">
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
                    ? 'bg-[#315CF5] text-white border-[#315CF5] shadow-xs'
                    : 'bg-[#F7F9FC] text-[#172033] border-[#E6EAF0] hover:border-[#D0D7E3]'
                }`}
              >
                <span className="font-semibold">{r.companyName}</span>
                {r.ticker && <span className="font-mono text-[10px] opacity-80">({r.ticker})</span>}
                <RiskBadge level={r.overallRiskLevel} size="sm" />
              </button>
            );
          })}

          {historyReports.length === 0 && (
            <div className="text-xs text-[#68758A] py-2">
              No historical reports available yet. Conduct research on companies first.
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#E05252]/10 border border-[#E05252]/20 rounded-xl text-xs text-[#E05252] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#315CF5] mx-auto" />
          <p className="text-xs text-[#68758A] font-mono">Analyzing and cross-referencing metrics...</p>
        </div>
      )}

      {/* Comparative AI Verdict Banner */}
      {comparisonData?.verdict && !loading && (
        <div className="p-6 bg-[#F0F4FE] border border-[#DBE4FD] rounded-2xl flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#315CF5]/10 border border-[#315CF5]/20 text-[#315CF5] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase text-[#315CF5] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Comparative Synthesis
            </span>
            <p className="mt-1 text-sm font-semibold text-[#172033] leading-relaxed">
              {comparisonData.verdict}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      {comparisonData?.comparison && !loading && (
        <div className="panel-card p-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6EAF0] text-[#68758A] font-mono uppercase text-[11px]">
                <th className="pb-4 w-48">Metric / Dimension</th>
                {comparisonData.comparison.map((item) => (
                  <th key={item.id} className="pb-4 font-bold text-[#172033] text-sm">
                    {item.companyName}
                    <span className="block text-[11px] font-mono text-[#68758A] font-normal">
                      {item.ticker !== 'N/A' ? item.ticker : 'Private'} • {item.sector}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F9] font-mono">
              {/* Safety Score */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Investment Safety Score</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-base font-bold text-[#172033]">
                    {item.overallSafetyScore}/100
                  </td>
                ))}
              </tr>

              {/* Risk Level */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Risk Classification</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5">
                    <RiskBadge level={item.overallRiskLevel} size="sm" />
                  </td>
                ))}
              </tr>

              {/* Physical Legitimacy */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Physical Legitimacy Score</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-[#172033]">
                    {item.legitimacyScore}/100
                  </td>
                ))}
              </tr>

              {/* Office Type */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Location Classification</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-[#172033] font-sans">
                    {item.locationType}
                    {item.isVirtualOffice && (
                      <span className="block text-[10px] text-[#E05252] font-mono font-semibold">
                        ⚠️ Virtual Office ({item.virtualOfficeProvider})
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Solvency Status */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Solvency Rating</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 font-bold text-[#159B70]">
                    {item.solvencyRating}
                  </td>
                ))}
              </tr>

              {/* Revenue */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Annual Revenue</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-[#172033]">
                    {formatCurrency(item.revenue)}
                  </td>
                ))}
              </tr>

              {/* Net Profit Margin */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Net Profit Margin</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-[#172033]">
                    {formatPercent(item.profitMargin)}
                  </td>
                ))}
              </tr>

              {/* Debt to Equity */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Debt-to-Equity</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-[#172033]">
                    {item.debtToEquity}
                  </td>
                ))}
              </tr>

              {/* Current Ratio */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Current Ratio</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 text-[#172033]">
                    {item.currentRatio}
                  </td>
                ))}
              </tr>

              {/* Red Flags Count */}
              <tr className="hover:bg-[#F7F9FC]">
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Identified Red Flags</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5 font-bold text-[#E05252]">
                    {item.redFlagsCount} flags
                  </td>
                ))}
              </tr>

              {/* View Full Link */}
              <tr>
                <td className="py-3.5 font-sans font-bold text-[#68758A]">Dossier Link</td>
                {comparisonData.comparison.map((item) => (
                  <td key={item.id} className="py-3.5">
                    <Link
                      to={`/research/${item.id}`}
                      className="text-[#315CF5] hover:underline font-sans font-semibold"
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
