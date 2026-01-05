import React, { useEffect, useState } from "react";

const RiskGauge = ({ score, label }) => {
  // The value from your calibration script
  const REAL_CEILING = 0.8926;

  let percent;
  let color;
  let text;
  let subText = "Forensic Confidence";

  // --- NEW FORENSIC LOGIC ---
  if (label === "REAL") {
    // If it's REAL but the score is high (like your AI image),
    // we show it as "Warning/Amber" instead of "100% Green"
    if (score > 0.5) {
       percent = 50;
       color = "#facc15"; // Amber (Warning)
       text = "SUSPICIOUS";
       subText = "High Noise/Possible AI";
    } else {
       // Normal safety scaling
       const safety = (REAL_CEILING - score) / REAL_CEILING;
       percent = Math.round(Math.max(0, safety * 100));
       color = "#10b981"; // Emerald
       text = "AUTHENTIC";
    }
  } else {
    // FAKE logic
    const danger = (score - REAL_CEILING) / (1 - REAL_CEILING);
    percent = Math.round(Math.max(0, danger * 100));
    color = "#ef4444"; // Red
    text = "SYNTHETIC";
  }

  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 200);
    return () => clearTimeout(t);
  }, [percent]);

  const radius = 85;
  const circumference = Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const rotation = (animated / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center w-full max-w-[280px] p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-2xl backdrop-blur-md">
      <svg viewBox="0 0 200 140" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>

        <path d="M 20 120 A 80 80 0 0 1 180 120" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

        <path
          d="M 20 120 A 80 80 0 0 1 180 120"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        <g transform={`rotate(${rotation}, 100, 120)`} className="transition-transform duration-1000 ease-out">
          <line x1="100" y1="120" x2="100" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="120" r="4" fill="white" />
        </g>

        <text x="100" y="85" textAnchor="middle" className="fill-white font-black text-4xl italic uppercase tabular-nums">
          {animated}%
        </text>
        <text x="100" y="110" textAnchor="middle" className="font-black text-[10px] tracking-[0.3em]" style={{ fill: color }}>
          {text}
        </text>
      </svg>

      <div className="mt-4 w-full border-t border-white/5 pt-4 flex flex-col items-center gap-1">
        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">{subText}</span>
        <div className="text-[10px] font-mono text-slate-400">
          RAW_SIG: <span className="text-white">{(score * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;