import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { researchService } from '../services/researchService.js';
import { useResearch } from '../context/ResearchContext.jsx';
import { formatCurrency, formatPercent } from '../utils/formatters.js';
import {
  TrendingUp,
  DollarSign,
  BarChart2,
  PieChart,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const FinancialAnalysisPage = () => {
  const [searchParams] = useSearchParams();
  const { currentReport } = useResearch();
  const researchId = searchParams.get('researchId') || currentReport?._id;

  const [report, setReport] = useState(currentReport);
  const [loading, setLoading] = useState(!currentReport);

  useEffect(() => {
    if (researchId && (!report || report._id !== researchId)) {
      setLoading(true);
      researchService
        .getById(researchId)
        .then((data) => setReport(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [researchId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
        <p className="text-xs text-slate-400 font-mono mt-3">Loading audited financial statements...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="panel-card p-8 text-center max-w-md mx-auto space-y-4">
        <TrendingUp className="w-10 h-10 text-brand-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Active Company Selected</h3>
        <p className="text-xs text-slate-400">
          Choose a research report from your dashboard to view financial diagnostics.
        </p>
        <Link to="/dashboard" className="inline-block bg-brand-600 text-white text-xs px-4 py-2 rounded-lg">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const f = report.snapshotData?.financials || {};
  const history = f.annualHistory || [];

  const chartData = history.map((item) => ({
    year: item.year,
    Revenue: item.revenue / 1e9,
    'Net Income': item.netIncome / 1e9,
    'Operating Cash Flow': (item.operatingCashFlow || 0) / 1e9,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Financial Performance & Solvency Health
            </h1>
            <span className="text-xs font-mono bg-brand-500/10 text-brand-400 px-2.5 py-0.5 rounded border border-brand-500/20">
              AUDITED FINANCIALS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical revenues, earnings stability, balance sheet leverage, and liquidity buffers for{' '}
            <span className="text-white font-semibold">{report.companyName}</span>.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono uppercase text-slate-400">Solvency Status</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{f.solvencyRating || 'SOUND'}</div>
        </div>
      </div>

      {/* Ratios & Key Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="panel-card p-4 border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Market Cap</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">{formatCurrency(f.marketCap)}</span>
        </div>
        <div className="panel-card p-4 border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Annual Revenue</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">{formatCurrency(f.revenue)}</span>
        </div>
        <div className="panel-card p-4 border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Net Income</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">{formatCurrency(f.netIncome)}</span>
        </div>
        <div className="panel-card p-4 border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Profit Margin</span>
          <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">{formatPercent(f.profitMargin)}</span>
        </div>
        <div className="panel-card p-4 border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Debt-to-Equity</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">{f.debtToEquity || 'N/A'}</span>
        </div>
        <div className="panel-card p-4 border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Ratio</span>
          <span className="text-lg font-bold text-white font-mono mt-1 block">{f.currentRatio || 'N/A'}</span>
        </div>
      </div>

      {/* Annual Revenue & Earnings Trajectory Chart */}
      <div className="panel-card p-6 border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Multi-Year Revenue & Net Income Trajectory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Reported annual earnings in Billions (USD)</p>
          </div>
          <BarChart2 className="w-5 h-5 text-slate-500" />
        </div>

        <div className="h-72 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={12} fontMono />
                <YAxis stroke="#64748b" fontSize={12} fontMono />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Operating Cash Flow" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No historical trajectory records available.
            </div>
          )}
        </div>
      </div>

      {/* Historical Annual Table */}
      <div className="panel-card p-6 border-slate-800">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4">
          Financial Statement Breakdown By Fiscal Year
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <th className="pb-3">Fiscal Year</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Net Income</th>
                <th className="pb-3">Operating Cash Flow</th>
                <th className="pb-3">Free Cash Flow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.map((row) => (
                <tr key={row.year} className="hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-white">{row.year}</td>
                  <td className="py-3 text-slate-200">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 text-emerald-400 font-semibold">{formatCurrency(row.netIncome)}</td>
                  <td className="py-3 text-slate-300">{formatCurrency(row.operatingCashFlow)}</td>
                  <td className="py-3 text-slate-300">{formatCurrency(row.freeCashFlow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

