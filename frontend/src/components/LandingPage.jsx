import { motion } from "framer-motion";
import { ShieldCheck, ScanSearch, Cpu, Lock } from "lucide-react";

export default function LandingPage({ onLogin }) {
  return (
    <div className="h-screen w-full bg-[#030303] text-slate-50 flex overflow-hidden selection:bg-blue-500/30">
      {/* LEFT PANEL */}
      <motion.div
        className="w-1/2 flex flex-col justify-center px-24 z-20"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600/10 p-2 rounded border border-blue-500/20 text-blue-500">
            <ShieldCheck size={18} strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-[0.2em] uppercase text-[10px] text-slate-400">
            TrustGuard Protocol
          </span>
        </div>

        <h1 className="text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Forensic-Grade <br />
          <span className="text-slate-400">Media Verification</span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-12 font-light">
          Verify digital integrity with neural analysis. Our lab identifies
          synthetic manipulation and generative artifacts through frequency-domain
          forensics.
        </p>

        <div className="flex flex-col gap-5">
          <motion.button
            onClick={onLogin}
            whileHover={{ scale: 1.02, backgroundColor: "#3b82f6" }}
            whileTap={{ scale: 0.98 }}
            className="w-fit px-8 py-4 bg-blue-600 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors duration-200 flex items-center gap-3"
          >
            Authenticate Access
          </motion.button>

          <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-slate-800" />
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
              Zero-knowledge architecture • Encrypted Session
            </p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        className="w-1/2 relative flex items-center justify-center bg-[#050505]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-transparent" />

        <motion.div
          className="grid grid-cols-2 gap-4 z-10 p-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <Feature
            icon={<ScanSearch size={20} />}
            title="Synthetic Detection"
            desc="Frequency-domain analysis for GAN and Diffusion artifacts."
          />
          <Feature
            icon={<Cpu size={20} />}
            title="Neural Explainability"
            desc="Grad-CAM visual evidence for automated verdicts."
          />
          <Feature
            icon={<ShieldCheck size={20} />}
            title="Integrity Scoring"
            desc="Confidence-weighted reports for legal verification."
          />
          <Feature
            icon={<Lock size={20} />}
            title="Stateless Processing"
            desc="Ephemeral analysis ensures no media persistence."
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      className="p-6 rounded-sm bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm group hover:border-blue-500/30 transition-colors duration-300"
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="text-blue-500/80 mb-4 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <p className="text-xs font-bold tracking-wider uppercase mb-2 text-slate-200">
        {title}
      </p>
      <p className="text-[11px] leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors">
        {desc}
      </p>
    </motion.div>
  );
}