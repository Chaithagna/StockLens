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
 * Map risk level to light-theme semantic colors
 * Low: #159B70, Moderate: #E9A23B, High: #F97316, Critical: #E05252
 */
export const getRiskColor = (level) => {
  const norm = (level || '').toUpperCase();
  switch (norm) {
    case 'LOW':
      return {
        bg: 'bg-[#159B70]/10',
        text: 'text-[#159B70]',
        border: 'border-[#159B70]/25',
        badge: 'bg-[#159B70] text-white',
        dot: 'bg-[#159B70]',
      };
    case 'MODERATE':
      return {
        bg: 'bg-[#E9A23B]/10',
        text: 'text-[#B47414]',
        border: 'border-[#E9A23B]/30',
        badge: 'bg-[#E9A23B] text-white',
        dot: 'bg-[#E9A23B]',
      };
    case 'HIGH':
      return {
        bg: 'bg-[#F97316]/10',
        text: 'text-[#EA580C]',
        border: 'border-[#F97316]/30',
        badge: 'bg-[#F97316] text-white',
        dot: 'bg-[#F97316]',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-[#E05252]/10',
        text: 'text-[#E05252]',
        border: 'border-[#E05252]/30',
        badge: 'bg-[#E05252] text-white',
        dot: 'bg-[#E05252]',
      };
    default:
      return {
        bg: 'bg-[#F1F4F9]',
        text: 'text-[#68758A]',
        border: 'border-[#E6EAF0]',
        badge: 'bg-[#E6EAF0] text-[#172033]',
        dot: 'bg-[#68758A]',
      };
  }
};
