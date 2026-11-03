import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { StatCard } from '../components/common/StatCard.jsx';
import { RiskBadge } from '../components/common/RiskBadge.jsx';
import { formatDate } from '../utils/formatters.js';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
  Loader2,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { dashboardStats, fetchStats, initiateResearch } = useResearch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStats().finally(() => setLoading(false));
  }, [fetchStats]);

  const handleQuickInitiate = async (e) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;

    setSubmitting(true);
    try {
      const report = await initiateResearch(quickSearch.trim());
      navigate(`/research/${report._id}`);
    } catch (err) {
      alert(`Research initiation failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const riskData = [
    { name: 'Low Risk', value: dashboardStats?.riskDistribution?.low || 0, color: '#10b981' },
    { name: 'Moderate Risk', value: dashboardStats?.riskDistribution?.moderate || 0, color: '#f59e0b' },
    { name: 'High Risk', value: dashboardStats?.riskDistribution?.high || 0, color: '#f97316' },
    { name: 'Critical Risk', value: dashboardStats?.riskDistribution?.critical || 0, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const total = dashboardStats?.totalResearched || 0;

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Search Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Research Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-slate-200 font-semibold">{user?.name}</span>. Real-time diligence summaries and portfolio safety monitoring.
          </p>
        </div>

        {/* Quick Launch Search */}
        <form onSubmit={handleQuickInitiate} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Enter company name or ticker..."
              className="w-full glass-input pl-10"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Investigate</span>
          </button>
        </form>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Researched"
          value={total}
          subtitle="Companies investigated"
          icon={Building2}
          color="brand"
        />
        <StatCard
          title="Low Risk Reports"
          value={dashboardStats?.riskDistribution?.low || 0}
          subtitle="Fortress profile verified"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Moderate Risk"
          value={dashboardStats?.riskDistribution?.moderate || 0}
          subtitle="Notable factors flagged"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="High / Critical"
          value={(dashboardStats?.riskDistribution?.high || 0) + (dashboardStats?.riskDistribution?.critical || 0)}
          subtitle="Severe red flags detected"
          icon={Flame}
          color="rose"
        />
      </div>

      {/* Middle Grid: Risk Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="panel-card p-6 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Risk Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Diligence safety classifications</p>
            </div>
            <PieIcon className="w-4 h-4 text-slate-500" />
          </div>

          <div className="h-48 flex items-center justify-center relative">
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500">
                No research records logged yet. Initiate your first audit.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Low: {dashboardStats?.riskDistribution?.low || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Mod: {dashboardStats?.riskDistribution?.moderate || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>High: {dashboardStats?.riskDistribution?.high || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Crit: {dashboardStats?.riskDistribution?.critical || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Pipeline Activity Stream */}
        <div className="panel-card p-6 border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Recent Research Activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Execution logs and pipeline audits</p>
            </div>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-3">
            {dashboardStats?.recentActivity?.length > 0 ? (
              dashboardStats.recentActivity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-mono font-bold">
                      {item.ticker ? item.ticker.slice(0, 3) : item.companyName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-white">{item.companyName}</span>
                      <span className="text-slate-400 block text-[11px]">
                        Stage {item.currentStage}/8 • Status: {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-brand-400 font-mono font-semibold">{item.stageProgress}%</span>
                      <span className="text-slate-500 block text-[10px]">{formatDate(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent activity. Enter a company name above to begin.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Research Reports Table */}
      <div className="panel-card p-6 border-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Recently Completed Reports
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Audited dossiers saved in database snapshot</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-mono uppercase text-[11px]">
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Safety Score</th>
                <th className="pb-3 font-semibold">Legitimacy</th>
                <th className="pb-3 font-semibold">Risk Classification</th>
                <th className="pb-3 font-semibold">Audited Date</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dashboardStats?.recentReports?.length > 0 ? (
                dashboardStats.recentReports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{report.companyName}</span>
                        {report.ticker && (
                          <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {report.ticker}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-white">
                      {report.overallSafetyScore}/100
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {report.legitimacyScore}/100
                    </td>
                    <td className="py-3">
                      <RiskBadge level={report.overallRiskLevel} size="sm" />
                    </td>
                    <td className="py-3 text-slate-400 font-mono">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/research/${report._id}`}
                        className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 font-semibold"
                      >
                        <span>Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No reports saved yet. Click "New Research" to generate one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

