import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Crosshair, AlertTriangle, Activity } from "lucide-react";
import { startCamera, stopCamera } from "../utils/camera";

// --- Pseudo API Service for Live Monitoring ---
// Simulates continuous /monitor/frame analysis
const MOCK_INTERVAL_MS = 1500;

export default function LiveMonitor() {
  const videoRef = useRef(null);
  
  // Status states: "initializing" | "authentic" | "suspicious"
  const [status, setStatus] = useState("initializing");
  
  // Metrics
  const [faceAuthentic, setFaceAuthentic] = useState(true);
  const [livenessCheck, setLivenessCheck] = useState(true);
  const [riskScore, setRiskScore] = useState(0);

  useEffect(() => {
    startCamera(videoRef);

    let isMounted = true;
    let timer;

    // Simulate connection
    setTimeout(() => {
       if (!isMounted) return;
       setStatus("authentic");
       
       // Start mock polling loop simulation
       timer = setInterval(() => {
          if (!isMounted) return;
          
          // Randomly trigger suspicious activity (20% chance per tick)
          const isSuspicious = Math.random() > 0.8;
          
          if (isSuspicious) {
             setStatus("suspicious");
             setFaceAuthentic(false);
             setLivenessCheck(Math.random() > 0.5); // Randomize liveness failure
             setRiskScore(Math.floor(Math.random() * 20) + 75); // 75-94% risk
             
             // Auto-recover after 4 seconds
             setTimeout(() => {
                if (!isMounted) return;
                setStatus("authentic");
                setFaceAuthentic(true);
                setLivenessCheck(true);
                setRiskScore(Math.floor(Math.random() * 5)); // 0-4% risk
             }, 4000);

          } else if (status === "authentic") {
             // Jitter stable risk score slightly
             setRiskScore(Math.floor(Math.random() * 5)); // 0-4%
          }
       }, MOCK_INTERVAL_MS);

    }, 2000); // 2sec init

    return () => {
      isMounted = false;
      clearInterval(timer);
      stopCamera(videoRef);
    };
  }, [status]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-6 p-6 font-sans">
       
       {/* Left Column: Video Feed */}
       <div className="relative flex-1 bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center min-h-[400px]">
          
          <video
             ref={videoRef}
             autoPlay
             playsInline
             muted
             className={`w-full h-full object-cover transition-all duration-500 scale-105 ${status === "suspicious" ? "blur-[2px] grayscale-[50%]" : ""}`}
          />

          {/* Authentic HUD Overlay */}
          {status === "authentic" && (
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   SECURE FEED
                </div>

                {/* Face Bounding Box Guide */}
                <motion.div 
                   animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.4, 0.8, 0.4] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute left-[30%] top-[20%] w-[40%] h-[50%] border-2 border-emerald-500/50 rounded-xl"
                >
                   <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                   <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                   <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                   <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </motion.div>
             </div>
          )}

          {/* Suspicious Warning Overlay */}
          <AnimatePresence>
             {status === "suspicious" && (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 pointer-events-none border-[6px] border-red-500/50 z-10 flex items-center justify-center bg-red-900/10"
                >
                   <div className="absolute top-6 left-6 px-3 py-1.5 bg-red-500/20 backdrop-blur-md rounded border border-red-500 flex items-center gap-2">
                       <AlertTriangle size={16} className="text-red-400" />
                       <span className="text-red-300 font-mono text-xs font-bold uppercase tracking-widest">Compromised Feed</span>
                   </div>

                   {/* Glitch Bounding Box */}
                   <motion.div 
                      animate={{ x: [-5, 5, -2, 8, -5], y: [2, -5, 4, -1, 2], opacity: [0.4, 1, 0.3] }}
                      transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                      className="w-[45%] h-[55%] border-2 border-red-500 mix-blend-screen relative"
                   >
                     <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-red-500/80 px-2 py-0.5 text-[10px] text-white font-mono uppercase rotate-90">Deepfake Overlay</div>
                   </motion.div>
                </motion.div>
             )}
          </AnimatePresence>

          {/* Init Mask */}
          <AnimatePresence>
             {status === "initializing" && (
                <motion.div exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0B0F14] flex flex-col items-center justify-center gap-4 z-20">
                   <Activity size={32} className="text-blue-500 animate-pulse" />
                   <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">Connecting to Monitoring Node...</span>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* Right Column: Status Panel */}
       <div className="w-full md:w-80 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col">
          
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
             <Crosshair size={24} className={status === "suspicious" ? "text-red-500" : "text-blue-500"} />
             <h2 className="text-xl font-bold text-white tracking-tight">TrustGuard Monitor</h2>
          </div>

          <div className="space-y-6 flex-1">
             
             {/* Metric 1 */}
             <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Face Authenticity</span>
                {status === "initializing" ? <span className="text-slate-600">—</span> :
                 faceAuthentic ? <span className="text-emerald-400 text-sm font-bold">✓ Valid</span> :
                                 <span className="text-red-400 text-sm font-bold animate-pulse">✗ Invalid</span>}
             </div>

             {/* Metric 2 */}
             <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">Liveness Check</span>
                {status === "initializing" ? <span className="text-slate-600">—</span> :
                 livenessCheck ? <span className="text-emerald-400 text-sm font-bold">✓ Passed</span> :
                                 <span className="text-red-400 text-sm font-bold animate-pulse">✗ Failed</span>}
             </div>

             {/* Metric 3 (Risk Score) */}
             <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-sm font-medium text-slate-400">Deepfake Risk</span>
                   <span className={`text-xl font-black font-mono ${
                      status === "initializing" ? "text-slate-500" : 
                      riskScore > 50 ? "text-red-500" : "text-emerald-500"
                   }`}>
                      {status === "initializing" ? "--" : riskScore}%
                   </span>
                </div>
                
                {/* Visual bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                     className={`h-full ${riskScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                     animate={{ width: `${status === "initializing" ? 0 : riskScore}%` }}
                     transition={{ duration: 0.3 }}
                   />
                </div>
             </div>

          </div>

          {/* Unified Status Footer */}
          <div className={`mt-8 px-4 py-3 rounded-xl border flex items-center justify-center gap-2 ${
             status === "initializing" ? "bg-white/5 border-white/10 text-slate-500" :
             status === "suspicious" ? "bg-red-500/10 border-red-500/30 text-red-400" :
             "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}>
             {status === "initializing" && "Awaiting connection..."}
             {status === "authentic" && <><ShieldCheck size={16} /> <span>Status: Authentic</span></>}
             {status === "suspicious" && <><AlertTriangle size={16} /> <span className="font-bold">Suspicious Activity</span></>}
          </div>

       </div>

    </div>
  );
}
