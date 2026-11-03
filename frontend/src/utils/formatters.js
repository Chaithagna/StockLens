/**
 * Format currency values e.g. 3500000000000 -> $3.50T or $1.25B
 */
export const formatCurrency = (val, currency = 'USD') => {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  const num = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (num >= 1e12) {
    return `${sign}$${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `${sign}$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${sign}$${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${sign}$${(num / 1e3).toFixed(1)}K`;
  }
  return `${sign}$${num.toLocaleString()}`;
};

/**
 * Format percentage values e.g. 23.4 -> 23.4%
 */
export const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return 'N/A';
  return `${Number(val).toFixed(1)}%`;
};

/**
 * Format dates into friendly readable strings
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Map risk level to semantic colors
 */
export const getRiskColor = (level) => {
  const norm = (level || '').toUpperCase();
  switch (norm) {
    case 'LOW':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500 text-slate-950',
      };
    case 'MODERATE':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500 text-slate-950',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-500 text-white',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-rose-600 text-white',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-700 text-slate-200',
      };
  }
};

