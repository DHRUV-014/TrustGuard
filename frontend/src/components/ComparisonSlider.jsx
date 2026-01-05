import React from 'react';
import { Target, ScanSearch } from 'lucide-react';
import { ImgComparisonSlider } from "@img-comparison-slider/react";

const ComparisonSlider = ({ original, heatmap, isProcessing }) => {
  return (
    <div className="relative w-full aspect-video bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
      
      {/* The Core Slider Component */}
      <ImgComparisonSlider
        hover="true"
        className="w-full h-full outline-none"
      >
        {/* FIRST SLOT: ORIGINAL IMAGE */}
        <div slot="first" className="relative w-full h-full bg-black">
          <img 
            src={original} 
            className="w-full h-full object-contain" 
            alt="Original forensic evidence" 
          />
          <div className="absolute top-4 left-4 glass px-3 py-1 rounded-md text-[10px] font-bold tracking-widest text-blue-400 flex items-center gap-2 z-10">
            <Target size={12} /> ORIGINAL FACE
          </div>
        </div>

        {/* SECOND SLOT: HEATMAP (FALLBACK TO PROCESSED ORIGINAL IF NO HEATMAP YET) */}
        <div slot="second" className="relative w-full h-full bg-black">
          <img 
            src={heatmap || original} 
            className={`w-full h-full object-contain ${!heatmap ? 'sepia hue-rotate-[240deg] saturate-[3] brightness-75' : ''}`} 
            alt="AI Forensic Heatmap" 
          />
          
          {/* Simulation Overlay (only shown if real heatmap hasn't arrived yet) */}
          {!heatmap && (
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-red-500/20 to-yellow-500/20 mix-blend-color-dodge opacity-80"></div>
          )}
          
          <div className="absolute top-4 right-4 glass px-3 py-1 rounded-md text-[10px] font-bold tracking-widest text-amber-400 flex items-center gap-2 z-10">
            <ScanSearch size={12} /> GRAD-CAM VISUALIZATION
          </div>
        </div>

        {/* CUSTOM HANDLE (STYLIZED) */}
        <div slot="handle" className="flex items-center justify-center">
            <div className="w-1 h-12 bg-white/20 rounded-full backdrop-blur-md border border-white/10"></div>
        </div>
      </ImgComparisonSlider>

      {/* PROCESSING OVERLAY (Logic from code 1) */}
      {isProcessing && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-md flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
                <p className="mono text-blue-400 animate-pulse tracking-[0.2em] text-[10px] font-bold uppercase">
                  Mapping Neural Weights...
                </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonSlider;