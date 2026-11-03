import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', change = null }) => {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    slate: 'text-slate-400 bg-slate-800/50 border-slate-700/50',
  };

  return (
    <div className="panel-card p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-mono tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              {change && (
                <span className={`font-mono font-medium ${change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {change > 0 ? `+${change}%` : `${change}%`}
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${colorMap[color] || colorMap.brand}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent group-hover:via-brand-500/50 transition-all" />
    </div>
  );
};

