import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCheck, CheckCircle2 } from "lucide-react";
import { startCamera, captureFrame, stopCamera } from "../utils/camera";

// --- Pseudo API Services for Creator Verification ---
const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function startCreatorVerification() {
  await fakeDelay(500);
  return { session_id: "cv_" + Math.random().toString(36).substr(2, 9) };
}

async function sendVerificationFrame() {
  // Simulate network POST /verify/creator/frame/{session_id}
  await fakeDelay(200);
}

async function finishCreatorVerification() {
  // Simulate network GET /verify/creator/result/{session_id}
  await fakeDelay(1500);
  return {
    verified: true,
    confidence: 0.98,
    is_live: true,
    face_match: true
  };
}

export default function CreatorVerification({ onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Steps: "idle" | "detecting" | "scanning" | "verified"
  const [step, setStep] = useState("idle");
  const [progress, setProgress] = useState(0);

  const startVerificationFlow = async () => {
    setStep("scanning");
    
    try {
      const session = await startCreatorVerification();
      
      // Simulate capturing 5 frames over 2.5 seconds
      for (let i = 1; i <= 5; i++) {
        await captureFrame(videoRef, canvasRef);
        await sendVerificationFrame(session.session_id);
        setProgress((i / 5) * 100);
      }

      const result = await finishCreatorVerification(session.session_id);
      
      if (result.verified) {
        setStep("verified");
      } else {
        setStep("idle"); // reset on fail (simplified)
      }

    } catch (e) {
      console.error(e);
      setStep("idle");
    }
  };

  useEffect(() => {
    // Start camera immediately on mount
    startCamera(videoRef);
    
    // Auto start detection after a short delay
    const timer = setTimeout(() => {
       setStep("detecting");
       setTimeout(() => {
          startVerificationFlow();
       }, 2000); // 2 seconds to position face
    }, 1000);

    return () => {
      clearTimeout(timer);
      stopCamera(videoRef);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto text-center font-sans relative overflow-hidden bg-black rounded-3xl p-8 border border-white/10 shadow-2xl">
      
      <AnimatePresence mode="wait">
        
        {/* Step 1 & 2: Camera View */}
        {step !== "verified" && (
          <motion.div 
            key="camera-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center w-full"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Verify Your Identity</h2>
            <p className="text-sm text-slate-400 mb-8">
               {step === "idle" ? "Initializing secure camera stream..." : 
                step === "detecting" ? "Look directly at the camera" :
                "Hold still. Analyzing facial depth mapping..."}
            </p>

            <div className="relative mb-12 flex items-center justify-center">
               {/* Fixed width/height container to maintain the circle */}
               <div 
                 className="relative overflow-hidden flex items-center justify-center"
                 style={{ 
                    width: "320px", 
                    height: "320px",
                    borderRadius: "50%",
                    // Ring matching the Apple FaceID prompt
                    border: step === "detecting" ? "4px solid rgba(255,255,255,0.2)" : "4px solid rgba(37,99,235,0.8)",
                    boxShadow: step === "scanning" ? "0 0 40px rgba(37,99,235,0.4)" : "0 0 60px rgba(0,150,255,0.15)",
                    transition: "all 0.5s ease"
                 }}
               >
                 <video
                   ref={videoRef}
                   autoPlay
                   playsInline
                   muted
                   className="absolute inset-0 w-full h-full object-cover scale-125 select-none pointer-events-none"
                 />

                 {/* Scanning Overlay Effect */}
                 {step === "scanning" && (
                    <motion.div 
                      className="absolute inset-0 bg-blue-500/20 mix-blend-overlay pointer-events-none"
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                 )}
               </div>

               {/* External rotating scan ring */}
               {step === "scanning" && (
                 <motion.div 
                   className="absolute w-[360px] h-[360px] rounded-full border border-blue-400/30 border-dashed pointer-events-none"
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 />
               )}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-12 flex flex-col justify-center items-center">
               <AnimatePresence>
                 {step === "scanning" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full"
                    >
                       <div className="flex justify-between text-xs text-blue-400 mb-2 font-mono uppercase tracking-widest">
                         <span>Authenticity Scan</span>
                         <span>{Math.round(progress)}%</span>
                       </div>
                       <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.2 }}
                         />
                       </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Step 3: Verified Result */}
        {step === "verified" && (
          <motion.div 
            key="verified-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full py-12"
          >
             <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
               <CheckCircle2 size={48} className="text-emerald-500" />
             </div>
             
             <h2 className="text-3xl font-bold tracking-tight text-white mb-2">TrustGuard Verified Creator</h2>
             
             <div className="flex flex-col items-start gap-4 mt-8 mb-12 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={18} className="text-emerald-400" />
                   <span>Live Presence Verified</span>
                </div>
                <div className="flex items-center gap-3">
                   <UserCheck size={18} className="text-emerald-400" />
                   <span>Facial Consistency Confirmed</span>
                </div>
             </div>

             <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-md mb-10 inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Status: Verified</span>
             </div>

             <button 
               onClick={() => onComplete && onComplete()}
               className="px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-full font-semibold transition-colors shadow-lg"
             >
               Attach Verification to Upload
             </button>
          </motion.div>
        )}

      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
