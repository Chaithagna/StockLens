import React from 'react';
import { getRiskColor } from '../../utils/formatters.js';

export const RiskBadge = ({ level, size = 'md' }) => {
  const colors = getRiskColor(level);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.badge}`} />
      {level || 'UNKNOWN'} RISK
    </span>
  );
};

