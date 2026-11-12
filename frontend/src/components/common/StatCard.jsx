import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', change = null }) => {
  const colorMap = {
    brand: 'text-[#315CF5] bg-[#315CF5]/10 border-[#315CF5]/20',
    emerald: 'text-[#159B70] bg-[#159B70]/10 border-[#159B70]/20',
    amber: 'text-[#E9A23B] bg-[#E9A23B]/10 border-[#E9A23B]/20',
    rose: 'text-[#E05252] bg-[#E05252]/10 border-[#E05252]/20',
    teal: 'text-[#16A6A0] bg-[#16A6A0]/10 border-[#16A6A0]/20',
    slate: 'text-[#68758A] bg-[#F1F4F9] border-[#E6EAF0]',
  };

  return (
    <div className="panel-card p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#68758A] font-mono">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-[#172033] mt-1.5 font-mono tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-[#68758A] mt-1 flex items-center gap-1.5">
              {change && (
                <span className={`font-mono font-medium ${change > 0 ? 'text-[#159B70]' : 'text-[#E05252]'}`}>
                  {change > 0 ? `+${change}%` : `${change}%`}
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${colorMap[color] || colorMap.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#315CF5]/40 transition-all" />
    </div>
  );
};
