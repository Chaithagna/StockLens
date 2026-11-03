import React from 'react';

export const SafetyScoreGauge = ({ score = 0, size = 120, strokeWidth = 10, label = 'SAFETY SCORE' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  let color = '#ef4444'; // Red < 40
  if (clamped >= 75) color = '#10b981'; // Emerald
  else if (clamped >= 60) color = '#f59e0b'; // Amber
  else if (clamped >= 40) color = '#f97316'; // Orange

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white font-mono">{clamped}</span>
        <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold mt-0.5">/ 100</span>
      </div>
      {label && <span className="text-xs font-medium text-slate-400 mt-2 tracking-wider">{label}</span>}
    </div>
  );
};

