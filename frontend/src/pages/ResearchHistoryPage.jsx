import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { RiskBadge } from '../components/common/RiskBadge.jsx';
import { formatDate } from '../utils/formatters.js';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  GitCompare,
  AlertCircle,
  Loader2,
  Bot,
  Calendar,
} from 'lucide-react';

export const ResearchHistoryPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await researchService.getHistory({
        search,
        risk: riskFilter,
        limit: 50,
      });
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, riskFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this research snapshot?')) return;

    setDeletingId(id);
    try {
      await researchService.deleteReport(id);
      setReports(reports.filter((r) => r._id !== id));
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleCompareSelect = (id, e) => {
    e.stopPropagation();
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare a maximum of 4 reports simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 reports to launch side-by-side comparison.');
      return;
    }
    navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-brand-400" />
            <span>Research Archive & History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access previous diligence dossiers, compare historical snapshot updates, or select reports for side-by-side analysis.
          </p>
        </div>

        {selectedForCompare.length >= 2 && (
          <button
            onClick={handleLaunchCompare}
            className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Selected ({selectedForCompare.length})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or ticker..."
            className="w-full glass-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="glass-input text-xs py-1.5"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="panel-card p-6 border-slate-800">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500 mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Retrieving your private research history...</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 w-8">Select</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Safety Score</th>
                  <th className="pb-3">Legitimacy</th>
                  <th className="pb-3">Risk Classification</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Audited On</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reports.map((r) => {
                  const isSelected = selectedForCompare.includes(r._id);
                  return (
                    <tr
                      key={r._id}
                      className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-brand-950/20' : ''}`}
                    >
                      <td className="py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleCompareSelect(r._id, e)}
                          className="rounded border-slate-700 text-brand-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <Link to={`/research/${r._id}`} className="hover:text-brand-300">
                            {r.companyName}
                          </Link>
                          {r.ticker && (
                            <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                              {r.ticker}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-white">
                        {r.overallSafetyScore}/100
                      </td>
                      <td className="py-3.5 font-mono text-slate-300">
                        {r.legitimacyScore}/100
                      </td>
                      <td className="py-3.5">
                        <RiskBadge level={r.overallRiskLevel} size="sm" />
                      </td>
                      <td className="py-3.5 font-mono text-[11px] text-slate-400">
                        {r.status}
                      </td>
                      <td className="py-3.5 font-mono text-slate-400">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <Link
                          to={`/research/${r._id}`}
                          className="inline-flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(r._id, e)}
                          disabled={deletingId === r._id}
                          className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
                        >
                          {deletingId === r._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No research reports found</p>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria, or launch a new company audit.
            </p>
            <Link
              to="/search"
              className="inline-block mt-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
            >
              Start New Research
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

