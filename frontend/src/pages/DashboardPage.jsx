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
    { name: 'Low Risk', value: dashboardStats?.riskDistribution?.low || 0, color: '#159B70' },
    { name: 'Moderate Risk', value: dashboardStats?.riskDistribution?.moderate || 0, color: '#E9A23B' },
    { name: 'High Risk', value: dashboardStats?.riskDistribution?.high || 0, color: '#F97316' },
    { name: 'Critical Risk', value: dashboardStats?.riskDistribution?.critical || 0, color: '#E05252' },
  ].filter((d) => d.value > 0);

  const total = dashboardStats?.totalResearched || 0;

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Search Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6EAF0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033] tracking-tight">
            Research Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#68758A] mt-1">
            Welcome back, <span className="text-[#172033] font-semibold">{user?.name}</span>. Real-time due diligence summaries and corporate risk monitoring.
          </p>
        </div>

        {/* Quick Launch Search */}
        <form onSubmit={handleQuickInitiate} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA5B6]" />
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
            className="btn-primary shrink-0"
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
        <div className="panel-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-[#68758A] uppercase tracking-wider font-mono">
                Risk Distribution
              </h3>
              <p className="text-xs text-[#68758A] mt-0.5">Diligence safety classifications</p>
            </div>
            <PieIcon className="w-4 h-4 text-[#68758A]" />
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
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E6EAF0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(16, 24, 40, 0.08)',
                    }}
                    itemStyle={{ color: '#172033', fontSize: '12px', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-[#68758A]">
                No research records logged yet. Initiate your first audit.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#E6EAF0] text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#172033]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#159B70]" />
              <span>Low: {dashboardStats?.riskDistribution?.low || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#172033]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E9A23B]" />
              <span>Mod: {dashboardStats?.riskDistribution?.moderate || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#172033]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span>High: {dashboardStats?.riskDistribution?.high || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#172033]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E05252]" />
              <span>Crit: {dashboardStats?.riskDistribution?.critical || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Pipeline Activity Stream */}
        <div className="panel-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-[#68758A] uppercase tracking-wider font-mono">
                Recent Research Activity
              </h3>
              <p className="text-xs text-[#68758A] mt-0.5">Execution logs and pipeline audits</p>
            </div>
            <Clock className="w-4 h-4 text-[#68758A]" />
          </div>

          <div className="space-y-2.5">
            {dashboardStats?.recentActivity?.length > 0 ? (
              dashboardStats.recentActivity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F7F9FC] border border-[#E6EAF0] hover:border-[#D0D7E3] transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#315CF5]/10 border border-[#315CF5]/20 text-[#315CF5] flex items-center justify-center font-mono font-bold">
                      {item.ticker ? item.ticker.slice(0, 3) : item.companyName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-[#172033]">{item.companyName}</span>
                      <span className="text-[#68758A] block text-[11px]">
                        Stage {item.currentStage}/8 • Status: <span className="font-mono">{item.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[#315CF5] font-mono font-semibold">{item.stageProgress}%</span>
                      <span className="text-[#68758A] block text-[10px]">{formatDate(item.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#68758A]">
                No recent activity. Enter a company name above to begin.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Research Reports Table */}
      <div className="panel-card p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6EAF0]">
          <div>
            <h3 className="text-xs font-bold text-[#68758A] uppercase tracking-wider font-mono">
              Recently Completed Reports
            </h3>
            <p className="text-xs text-[#68758A] mt-0.5">Audited dossiers saved in database snapshot</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-[#315CF5] hover:underline flex items-center gap-1"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6EAF0] text-[#68758A] font-mono uppercase text-[11px]">
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Safety Score</th>
                <th className="pb-3 font-semibold">Legitimacy</th>
                <th className="pb-3 font-semibold">Risk Classification</th>
                <th className="pb-3 font-semibold">Audited Date</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F4F9]">
              {dashboardStats?.recentReports?.length > 0 ? (
                dashboardStats.recentReports.map((report) => (
                  <tr key={report._id} className="hover:bg-[#F7F9FC] transition-colors">
                    <td className="py-3 font-semibold text-[#172033]">
                      <div className="flex items-center gap-2">
                        <span>{report.companyName}</span>
                        {report.ticker && (
                          <span className="font-mono text-[10px] bg-[#F1F4F9] text-[#68758A] px-1.5 py-0.5 rounded border border-[#E6EAF0]">
                            {report.ticker}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-[#172033]">
                      {report.overallSafetyScore}/100
                    </td>
                    <td className="py-3 font-mono text-[#68758A]">
                      {report.legitimacyScore}/100
                    </td>
                    <td className="py-3">
                      <RiskBadge level={report.overallRiskLevel} size="sm" />
                    </td>
                    <td className="py-3 text-[#68758A] font-mono">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/research/${report._id}`}
                        className="inline-flex items-center gap-1 text-[#315CF5] hover:underline font-semibold"
                      >
                        <span>Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-[#68758A]">
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
