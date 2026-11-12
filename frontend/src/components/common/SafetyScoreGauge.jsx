import React from 'react';

export const SafetyScoreGauge = ({ score = 0, size = 120, strokeWidth = 9, label = 'SAFETY SCORE' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  let color = '#E05252'; // Danger < 40
  if (clamped >= 75) color = '#159B70'; // Success
  else if (clamped >= 60) color = '#E9A23B'; // Warning
  else if (clamped >= 40) color = '#F97316'; // High Orange

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E6EAF0"
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
        <span className="text-3xl font-extrabold text-[#172033] font-mono tracking-tight">{clamped}</span>
        <span className="text-[10px] tracking-widest text-[#68758A] uppercase font-semibold -mt-0.5">/ 100</span>
      </div>
      {label && <span className="text-[11px] font-semibold text-[#68758A] mt-2.5 tracking-wider uppercase font-mono">{label}</span>}
    </div>
  );
};
