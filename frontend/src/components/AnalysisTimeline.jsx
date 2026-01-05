import React from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

const AnalysisTimeline = ({ steps }) => {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.id} className="relative pl-8 group">
          {/* Connector Line */}
          {index !== steps.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-800 group-last:hidden"></div>
          )}

          {/* Status Icon */}
          <div className="absolute left-0 top-1">
            {step.status === 'completed' && <CheckCircle2 size={24} className="text-emerald-500" />}
            {step.status === 'loading' && <Loader2 size={24} className="text-cyan-400 animate-spin" />}
            {step.status === 'pending' && <Circle size={24} className="text-slate-600" />}
            {step.status === 'error' && <AlertCircle size={24} className="text-rose-500" />}
          </div>

          <div className="flex flex-col">
            <span className={`text-sm font-bold tracking-wide uppercase ${
              step.status === 'loading' ? 'text-cyan-400' :
              step.status === 'completed' ? 'text-slate-200' : 'text-slate-500'
            }`}>
              {step.name}
            </span>
            {step.details && (
              <span className="text-xs text-slate-400 mt-1 leading-relaxed mono">
                {step.details}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalysisTimeline;