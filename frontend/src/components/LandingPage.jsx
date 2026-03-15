import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ShieldCheck, ScanSearch, Cpu, Lock, PlayCircle, Eye, Activity, Database, AlertCircle, Search, Layers, Fingerprint, Zap } from "lucide-react";

// Components
import UploadZone from "./UploadZone";
import ResultCard from "./ResultCard";
import AnalysisTimeline from "./AnalysisTimeline";
import RiskGauge from "./RiskGauge";

// Removed AnimatedCounter since it is no longer used

export default function LandingPage({ onLogin }) {
  const [demoState, setDemoState] = useState('idle'); // idle, analyzing, done
  const { scrollYProgress } = useScroll();
  
  // Parallax effects for global background
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  const dummyResult = {
    label: "FAKE",
    score: 0.94,
    faces_detected: 1,
    face_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    heatmap_url: null,
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Global Background Particles & Grid */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFIMXYzOGgzOHoiIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] mix-blend-overlay opacity-50" />
        <motion.div 
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.3)_0%,transparent_50%)]"
        />
      </motion.div>

      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-500" size={24} />
          <span className="font-bold tracking-wider text-sm">TRUSTGUARD</span>
        </div>
        <button 
          onClick={onLogin}
          className="text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-sm transition-colors border border-white/10"
        >
          Login
        </button>
      </nav>

      {/* 1. Cinematic Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-24 min-h-[100vh] flex flex-col items-center justify-center overflow-hidden z-10 w-full">
        
        {/* Deep Parallax Background Engine */}
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) }} className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-40">
           {/* Abstract Neural Connectivity Ring */}
           <motion.div 
             animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border-[1px] border-blue-500/10 border-dashed absolute"
           />
           <motion.div 
             animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
             transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
             className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border-[1px] border-purple-500/10 absolute"
           />
        </motion.div>

        {/* Central AI Scan Visual (Background Layer) */}
        <motion.div 
          style={{ 
             y: useTransform(scrollYProgress, [0, 1], ["0%", "20%"]),
             opacity: useTransform(scrollYProgress, [0, 0.4], [1, 0])
          }} 
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 mt-20"
        >
          <div className="relative w-[300px] h-[400px] md:w-[450px] md:h-[600px] flex items-center justify-center opacity-70">
            {/* Abstract Head Silhouette SVG */}
            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">
               {/* Head Outline */}
               <path 
                 d="M100,20 C140,20 160,50 170,90 C175,110 175,130 170,150 C160,190 140,210 120,225 C110,232 90,232 80,225 C60,210 40,190 30,150 C25,130 25,110 30,90 C40,50 60,20 100,20 Z"
                 fill="none" 
                 stroke="rgba(37,99,235,0.4)" 
                 strokeWidth="1"
                 strokeDasharray="4 4"
               />
               {/* Inner Neural Map / Brain Outline */}
               <path 
                 d="M100,35 C125,35 140,60 145,90 C150,120 140,165 100,190 C60,165 50,120 55,90 C60,60 75,35 100,35 Z"
                 fill="rgba(37,99,235,0.03)" 
                 stroke="rgba(168,85,247,0.3)" 
                 strokeWidth="0.5"
               />
               {/* Node Dots */}
               <circle cx="100" cy="50" r="2" fill="#60A5FA" />
               <circle cx="70" cy="90" r="1.5" fill="#60A5FA" />
               <circle cx="130" cy="90" r="1.5" fill="#60A5FA" />
               <circle cx="100" cy="140" r="2" fill="#A855F7" />
               <circle cx="80" cy="170" r="1" fill="#60A5FA" />
               <circle cx="120" cy="170" r="1" fill="#60A5FA" />
               {/* Connecting Lines */}
               <line x1="100" y1="50" x2="70" y2="90" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
               <line x1="100" y1="50" x2="130" y2="90" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
               <line x1="70" y1="90" x2="100" y2="140" stroke="rgba(168,85,247,0.2)" strokeWidth="0.5" />
               <line x1="130" y1="90" x2="100" y2="140" stroke="rgba(168,85,247,0.2)" strokeWidth="0.5" />
            </svg>

            {/* Scanning Laser Line */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_20px_2px_rgba(96,165,250,0.8)] z-10"
            />
            {/* Scanner Glow Wash */}
            <motion.div 
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-400/20 z-0 -translate-y-full"
            />

            {/* Heatmap Overlay Flashes */}
            <motion.div 
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="absolute top-[30%] left-[20%] w-[60%] h-[20%] bg-red-500/10 blur-xl rounded-full mix-blend-screen"
            />
            
            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 md:-right-24 top-[20%] border border-blue-500/30 bg-[#0B0F14]/80 backdrop-blur-md px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
            >
              <Activity size={12} className="text-blue-400" />
              <span className="text-[10px] text-blue-300 font-mono tracking-wider">CONF: 98.4%</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-12 md:-left-24 top-[60%] border border-purple-500/30 bg-[#0B0F14]/80 backdrop-blur-md px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              <Fingerprint size={12} className="text-purple-400" />
              <span className="text-[10px] text-purple-300 font-mono tracking-wider">BIO_MATCH: OK</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Hero Foreground Content */}
        <motion.div 
           style={{ 
             opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
             y: useTransform(scrollYProgress, [0, 0.3], ["0%", "-50%"]) 
           }}
           className="relative z-20 max-w-4xl w-full flex flex-col items-center text-center mt-[-10vh] md:mt-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-md mb-8">
               <ShieldCheck size={16} className="text-blue-400" />
               <span className="text-xs font-semibold tracking-widest text-blue-300 uppercase">TrustGuard Protocol Active</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-50 mb-6 leading-tight drop-shadow-2xl">
              Real-Time Deepfake <br className="hidden md:block" /> Detection Engine
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl font-light leading-relaxed drop-shadow-md">
              Analyze video, audio, and images using advanced AI models and forensic signal analysis to detect manipulated media instantly with cryptographic certainty.
            </p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} 
              className="relative group px-10 py-5 bg-transparent border border-blue-500/50 rounded-sm overflow-hidden"
            >
               <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/40 transition-colors duration-300 backdrop-blur-sm -z-10"></div>
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
               
               <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] transition-shadow duration-300">
                  <ScanSearch size={18} className="text-blue-300" />
                  Start Secure Analysis
               </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Problem Section (Scroll Animation) */}
      <section className="py-32 px-6 lg:px-24 bg-gradient-to-b from-[#0B0F14] to-[#0D131C] border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-slate-50">The Rise of <br/> <span className="text-red-400">Digital Deception</span></h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-6">
              In an era where generative AI can perfectly mimic reality, the truth is under attack. 
              Deepfakes are being weaponized for misinformation, financial fraud, and identity theft.
            </p>
            <p className="text-slate-400 leading-relaxed text-lg mb-6">
              Visual inspection is no longer enough. The human eye cannot detect the subtle frequency 
              anomalies and temporal inconsistencies introduced by modern diffusion models and GANs.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden border border-red-500/20 bg-black/40 backdrop-blur-md p-6 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.08)]">
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyMjIiPjwvcmVjdD4KPC9zdmc+')] opacity-20"></div>
               <motion.div 
                 animate={{ opacity: [1, 0.5, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }}
               >
                 <AlertCircle size={56} className="text-red-500 mb-4 z-10" />
               </motion.div>
               <p className="z-10 text-red-400 font-mono tracking-wider text-2xl uppercase font-bold">Trust Compromised</p>
               <p className="z-10 text-slate-500 font-mono text-sm mt-3 text-center px-4">Authenticity cannot be guaranteed without cryptographic or computational verification.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Multi-Modal AI Deepfake Detection */}
      <section className="py-32 px-6 lg:px-24 bg-[#0B0F14] relative z-10 overflow-hidden border-t border-white/5">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <motion.div 
             animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
             transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
             className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]"
           />
           {/* Particles/Lines background */}
           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iMTAgMEwxMCA0ME0zMCAwTDMwIDQwTTAgMTBMMDQgMTBNMCAzMEw0MCAzMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] mix-blend-overlay"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="text-center mb-16">
             <h2 className="text-3xl lg:text-5xl font-extrabold mb-6 text-slate-50 drop-shadow-md">Multi-Modal AI Deepfake Detection</h2>
             <p className="text-slate-400 text-lg max-w-3xl mx-auto font-light leading-relaxed">
               TrustGuard analyzes video, audio, and images using advanced forensic AI models to detect manipulation and synthetic media.
             </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Panel 1: Video Detection */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-48 rounded-xl bg-[#0F172A] border border-blue-500/20 mb-6 relative overflow-hidden flex items-center justify-center shadow-inner">
                 <div className="absolute inset-0 perspective flex items-center justify-center">
                    {[1, 2, 3].map((frame, idx) => (
                      <motion.div 
                        key={idx}
                        animate={{ 
                           y: [40, 0, -40], 
                           opacity: [0, 1, 0],
                           scale: [0.85, 1, 0.85]
                        }}
                        transition={{ 
                           duration: 3, 
                           repeat: Infinity, 
                           delay: idx * 1,
                           ease: "linear"
                        }}
                        className="absolute w-32 h-24 border border-blue-400/50 rounded-md bg-[#0B0F14]/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      >
                         <PlayCircle size={20} className="text-blue-500/50" />
                         <div className="absolute w-12 h-12 border border-blue-400 border-dashed rounded-sm flex items-center justify-center">
                            <motion.div 
                              animate={{ opacity: [0, 1, 0] }} 
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }} 
                              className="w-full h-full bg-red-500/20 mix-blend-screen"
                            />
                         </div>
                      </motion.div>
                    ))}
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[1px] bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] z-10"
                    />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
                <PlayCircle size={20} className="text-blue-400" />
                Video Detection
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Frame-level analysis detects facial inconsistencies, motion artifacts, and GAN generation signatures.
              </p>
            </motion.div>

            {/* Panel 2: Audio Analysis */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-48 rounded-xl bg-[#0F172A] border border-purple-500/20 mb-6 relative overflow-hidden flex items-end justify-center pb-8 shadow-inner px-4 gap-1">
                 {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: ["15%", `${Math.random() * 70 + 30}%`, "15%"] }}
                      transition={{ 
                         duration: Math.random() * 0.8 + 0.4, 
                         repeat: Infinity, 
                         repeatType: "reverse",
                         ease: "easeInOut",
                         delay: i * 0.05
                      }}
                      className="w-full max-w-[6px] bg-purple-500/60 rounded-t-sm"
                    />
                 ))}
                 <motion.div 
                   animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute top-10 left-[35%] bg-red-500/20 border border-red-500/50 text-[10px] text-red-300 font-mono px-2 py-0.5 rounded-sm z-20"
                 >
                   SYNTH_DETECT
                 </motion.div>
                 <motion.div 
                   animate={{ left: ["0%", "100%", "0%"] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 bottom-0 w-[1px] bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)] z-10"
                 />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Activity size={20} className="text-purple-400" />
                Audio Analysis
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Spectral analysis detects synthetic voice patterns, vocoder artifacts, and manipulated speech signals.
              </p>
            </motion.div>

            {/* Panel 3: Image Forensics */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-48 rounded-xl bg-[#0F172A] border border-emerald-500/20 mb-6 relative overflow-hidden flex items-center justify-center shadow-inner">
                 <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden z-0">
                    <div className="w-24 h-24 rounded-full bg-slate-700 border-[3px] border-slate-600 relative overflow-hidden shadow-2xl">
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                         transition={{ duration: 6, repeat: Infinity }}
                         className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.9)_0%,rgba(245,158,11,0.6)_50%,transparent_100%)] mix-blend-color-dodge z-10"
                       />
                       <motion.div 
                         animate={{ opacity: [0, 0, 0.6, 0.6, 0, 0] }}
                         transition={{ duration: 6, repeat: Infinity }}
                         className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDI1NSwwLDAuMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] z-20"
                       />
                    </div>
                 </div>
                 <motion.div 
                   animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0.8, 0.8, 1, 1.2, 0.8, 0.8] }}
                   transition={{ duration: 6, repeat: Infinity }}
                   className="absolute top-[20%] right-[30%] w-6 h-6 rounded-full border border-emerald-400 flex items-center justify-center z-30"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                 </motion.div>
                 <motion.div 
                   animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0.8, 0.8, 1, 1.2, 0.8, 0.8] }}
                   transition={{ duration: 6, repeat: Infinity, delay: 0.3 }}
                   className="absolute bottom-[25%] left-[25%] w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center z-30"
                 >
                    <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                 </motion.div>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3 flex items-center gap-2">
                <ScanSearch size={20} className="text-emerald-400" />
                Image Forensics
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Spatial artifact detection identifies diffusion model traces, blending artifacts, and manipulation signatures.
              </p>
            </motion.div>
            
          </div>
        </motion.div>
      </section>

      {/* 4. Solution Section */}
      <section className="py-32 px-6 lg:px-24 bg-[#0D131C] z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-slate-50">Restoring Truth with <br /> <span className="text-blue-400">Neural Verification</span></h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            TrustGuard employs a multi-modal neural architecture to analyze media at the pixel, frequency, and temporal levels. 
            We identify the invisible fingerprints left behind by generative models.
          </p>
        </motion.div>

        {/* Feature Cards with Staggered Entrance */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            { icon: <ScanSearch />, title: "Computer Vision Analysis", desc: "Proprietary CNNs trained on thousands of manipulated datasets to detect visual forgery at the pixel level." },
            { icon: <Activity />, title: "Temporal Signal Detection", desc: "Analyzes frame-to-frame variations in video to detect unrealistic physics, jitter, and micro-expressions." },
            { icon: <Fingerprint />, title: "Biometric Verification", desc: "Pinpoints unnatural blending boundaries and morphing artifacts in facial regions." },
            { icon: <ShieldCheck />, title: "Authenticity Scoring", desc: "Provides a deterministic, forensic confidence score to quantify the probability of manipulation." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <FeatureCard icon={feature.icon} title={feature.title} desc={feature.desc} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Pipeline Section (Interactive Animation) */}
      <section className="py-32 px-6 lg:px-24 bg-gradient-to-b from-[#0D131C] to-[#0A0E14] border-t border-white/5 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-20 text-center text-slate-50">AI Pipeline Visualization</h2>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4">
            
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-slate-800 z-0">
               <motion.div 
                 initial={{ width: "0%" }}
                 whileInView={{ width: "100%" }}
                 viewport={{ once: true }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 className="h-full bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.8)]"
               />
            </div>

            {[
              { step: "01", title: "Upload Media", icon: <Database /> },
              { step: "02", title: "Frame Extraction", icon: <Layers /> },
              { step: "03", title: "Neural Verification", icon: <Cpu /> },
              { step: "04", title: "Authenticity Score", icon: <ShieldCheck /> }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.5 }}
                className="relative flex flex-col items-center text-center group z-10 w-48"
              >
                <div className="w-[80px] h-[80px] rounded-2xl bg-[#0F172A] border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.2)] text-blue-400 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300">
                  {s.icon}
                </div>
                <div className="bg-blue-500/10 text-blue-300 text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest uppercase mb-3">
                  Step {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-200">{s.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. Demo Section */}
      <section id="demo" className="py-32 px-6 lg:px-24 bg-[#0B0F14] relative z-10">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.8 }}
           className="max-w-6xl mx-auto"
         >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-slate-50">Live Demonstration</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Test the TrustGuard engine. Upload a media file or use our sample data to see the forensic pipeline in action within our glass-style dashboard.
              </p>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 lg:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] grid grid-cols-1 lg:grid-cols-2 gap-12 relative overflow-hidden">
               {/* Internal Background Glow */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

               <div className="flex flex-col h-full bg-[#0A0D12] rounded-2xl border border-white/5 p-6 shadow-inner relative z-10">
                  <UploadZone onUpload={() => {
                     setDemoState('analyzing');
                     setTimeout(() => setDemoState('done'), 2500);
                  }} />
                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={() => {
                        setDemoState('analyzing');
                        setTimeout(() => setDemoState('done'), 2500);
                      }}
                       className="text-xs font-bold text-slate-400 hover:text-blue-400 transition-colors underline underline-offset-4 tracking-widest uppercase"
                    >
                      Or use sample deepfake data
                    </button>
                  </div>
               </div>

               <div className="flex flex-col items-center justify-center min-h-[400px] h-full bg-[#0A0D12] rounded-2xl border border-white/5 p-6 shadow-inner relative z-10">
                  
                  <AnimatePresence mode="wait">
                    {demoState === 'idle' && (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center opacity-50 flex flex-col items-center">
                        <ScanSearch size={48} className="mb-4 text-slate-600" />
                        <p className="font-mono text-sm tracking-widest text-slate-400 uppercase">Awaiting Target Media</p>
                      </motion.div>
                    )}

                    {demoState === 'analyzing' && (
                      <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm">
                          <AnalysisTimeline steps={[
                            { id: 1, name: "Data Ingestion", status: "completed", details: "File hash verified. Encrypted streaming initiated." },
                            { id: 2, name: "Frame Extraction", status: "completed", details: "Sampled at 10fps. 240 frames extracted." },
                            { id: 3, name: "Frequency Analysis", status: "loading", details: "Running FFT & evaluating spatial frequencies..." },
                            { id: 4, name: "Verdict Generation", status: "pending" }
                          ]} />
                      </motion.div>
                    )}

                    {demoState === 'done' && (
                       <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full">
                          <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
                            <ResultCard result={dummyResult} />
                            {/* Showing RiskGauge alongside ResultCard for premium dashboard feel */}
                            <RiskGauge score={dummyResult.score} label={dummyResult.label} />
                          </div>
                         
                          <button 
                           onClick={() => setDemoState('idle')}
                           className="mt-8 px-6 py-3 border border-white/10 rounded-md text-xs uppercase font-bold tracking-widest hover:bg-white/5 transition-colors text-slate-300"
                          >
                           Reset Pipeline
                          </button>
                       </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
         </motion.div>
      </section>

      {/* 7. Final CTA Section */}
      <section className="py-32 px-6 lg:px-24 bg-[#0B0F14] relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-4xl mx-auto text-center bg-gradient-to-tr from-blue-900/20 to-transparent border border-blue-500/20 rounded-3xl p-12 lg:p-20 shadow-[0_0_50px_rgba(37,99,235,0.1)] backdrop-blur-sm"
         >
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-slate-50">Verify Digital Authenticity <br/> with TrustGuard</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Integrate our forensic models into your platform via robust APIs or run on-premise for absolute privacy.
            </p>
            <button onClick={onLogin} className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-200 rounded-md text-sm font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 mx-auto">
              Start Secure Analysis
              <Zap size={16} />
            </button>
         </motion.div>
      </section>

      {/* 8. Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="pt-16 pb-8 px-6 lg:px-24 bg-[#05070A] border-t border-white/5 relative z-10"
      >
         <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <ShieldCheck size={20} className="text-slate-400" />
               <span className="font-bold tracking-widest text-slate-400">TRUSTGUARD OPS</span>
            </div>
            <p className="mb-4 md:mb-0 text-center">© {new Date().getFullYear()} TrustGuard Systems. Advanced AI Security.</p>
            <div className="flex gap-6">
               <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
               <a href="#" className="hover:text-blue-400 transition-colors">API Docs</a>
               <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            </div>
         </div>
      </motion.footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-[#111827] border border-white/5 hover:border-blue-500/30 hover:bg-[#151E2E] transition-all duration-300 group shadow-lg">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-3 group-hover:text-blue-300 transition-colors">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed font-light">{desc}</p>
    </div>
  );
}