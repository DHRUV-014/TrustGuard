import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Upload,
  Activity,
  User,
  Cpu,
  CheckCircle2,
  History,
  ExternalLink,
  Clock,
} from "lucide-react";

import { uploadFile, checkJobStatus, fetchHistory } from "../api";
import AnalysisTimeline from "./AnalysisTimeline";
import ComparisonSlider from "./ComparisonSlider";
import RiskGauge from "./RiskGauge";

const INITIAL_STEPS = [
  { id: "1", name: "Media Ingestion", status: "pending" },
  { id: "2", name: "Biometric Alignment", status: "pending" },
  { id: "3", name: "Classification Engine", status: "pending" },
  { id: "4", name: "Report Generation", status: "pending" },
];

const TABS = ["Analyze", "Insights", "API"];

// Shared animation constants for consistency
const BEZIER = [0.16, 1, 0.3, 1];
const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: BEZIER }
};

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("Analyze");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [typedText, setTypedText] = useState("");

  const [historyItems, setHistoryItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === "History") {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await fetchHistory();
      const normalized = (data || []).map((item) => ({
        ...item,
        id: item.id || item.job_id,
        timestamp: item.timestamp || item.created_at,
      }));
      setHistoryItems(normalized);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const viewHistoryItem = (item) => {
    setStatus("COMPLETED");
    setSteps((s) => s.map((x) => ({ ...x, status: "completed" })));
    setResult({
      ...item,
      label: item.label,
      score: item.score || item.fake_probability,
      metadata: item.metadata || {},
    });
    const backendUrl = "http://localhost:8000";
    const cleanPath = item.file_path?.startsWith("/") ? item.file_path : `/${item.file_path}`;
    setImage(`${backendUrl}${cleanPath}?t=${Date.now()}`);
    setActiveTab("Analyze");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);

    setSteps(INITIAL_STEPS);
    setStatus("PENDING");
    setResult(null);
    setTypedText("");

    const id = await uploadFile(file);
    setJobId(id);
  };

  useEffect(() => {
    if (!jobId || status === "COMPLETED" || status === "FAILED") return;

    const interval = setInterval(async () => {
      const data = await checkJobStatus(jobId);
      setStatus(data.status);

      if (data.status === "PROCESSING") {
        setSteps((s) =>
          s.map((x) => (x.id === "2" || x.id === "3" ? { ...x, status: "loading" } : x))
        );
      }

      if (data.status === "COMPLETED") {
        setResult(data);
        setSteps((s) => s.map((x) => ({ ...x, status: "completed" })));
        clearInterval(interval);
        loadHistory();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  useEffect(() => {
    if (!result?.metadata?.reason) {
      setTypedText("");
      return;
    }

    const fullText =
      "No significant manipulation artifacts. " +
      result.metadata.reason +
      " This assessment is derived from facial consistency, frequency artifacts, and cross-region agreement. The system explicitly avoids over-confident conclusions when signals conflict.";

    let i = 0;
    setTypedText("");

    const timer = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) clearInterval(timer);
    }, 18);

    return () => clearInterval(timer);
  }, [result]);

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      {/* ================= TOP BAR ================= */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: BEZIER }}
        className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur z-20"
      >
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-blue-600 p-2 rounded-md shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <ShieldCheck size={18} />
            </div>
            <span className="font-bold tracking-tight">TrustGuard</span>
          </motion.div>

          <div className="hidden md:flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-1.5 text-xs font-bold uppercase rounded transition-colors ${
                  activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-xs text-slate-400"
        >
          <User size={14} /> {user?.displayName || "Guest"}
        </motion.div>
      </motion.nav>

      {/* ================= BODY ================= */}
      <div className="flex-1 grid grid-cols-[260px_1fr_360px] overflow-hidden">
        {/* LEFT : PIPELINE + HISTORY */}
        <motion.aside
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: BEZIER, delay: 0.1 }}
          className="border-r border-white/10 px-6 py-8 flex flex-col justify-between bg-black/20"
        >
          <div>
            <h3 className="text-xs text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Activity size={12} className="text-blue-500" /> Pipeline
            </h3>
            <AnalysisTimeline steps={steps} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab("History")}
            className={`mt-8 w-full flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase transition border shadow-sm
              ${
                activeTab === "History"
                  ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                  : "text-slate-400 border-white/5 hover:bg-white/5"
              }`}
          >
            <History size={14} />
            History Log
          </motion.button>
        </motion.aside>

        {/* CENTER */}
        <main className="px-16 py-10 overflow-y-auto bg-[radial-gradient(circle_at_top,_#111_0%,_#050505_100%)]">
          <AnimatePresence mode="wait">
            {activeTab === "Analyze" && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: BEZIER }}
                className="max-w-6xl mx-auto space-y-10"
              >
                <motion.div
                  whileHover={{ scale: 1.005, borderColor: "rgba(59, 130, 246, 0.5)", backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => fileInputRef.current.click()}
                  className="group aspect-video border-2 border-dashed border-white/10 rounded-3xl
                             flex flex-col items-center justify-center cursor-pointer
                             transition-all duration-300 bg-white/[0.02]"
                >
                  <motion.div
                    initial={{ y: 0 }}
                    whileHover={{ y: -5 }}
                    className="p-4 bg-white/5 rounded-full group-hover:bg-blue-600/10 transition-colors shadow-inner"
                  >
                      <Upload size={40} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                  <p className="text-slate-300 font-medium mt-4">Upload forensic media</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">MP4, PNG, JPG, WEBP</p>
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: BEZIER }}
                  className="rounded-3xl border border-white/10 bg-black/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {image ? (
                      <motion.div
                        key="comparison-active"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ComparisonSlider
                          original={image}
                          heatmap={result?.heatmap_url ? `http://localhost:8000/${result.heatmap_url}` : null}
                          isProcessing={status === "PROCESSING"}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="comparison-idle"
                        className="h-[360px] flex items-center justify-center text-slate-600 text-xs uppercase tracking-tighter"
                      >
                        <motion.span
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Waiting for input stream...
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="grid grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: BEZIER }}
                    whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
                    className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center items-center shadow-lg transition-colors"
                  >
                    <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Classification Verdict</p>
                    <motion.p
                      key={result?.label}
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className={`text-3xl font-black ${result?.label === 'REAL' ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]' : result?.label === 'FAKE' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'}`}
                    >
                      {result ? result.label : "—"}
                    </motion.p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: BEZIER }}
                    whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}
                    className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg transition-colors"
                  >
                    {result ? (
                      <RiskGauge score={result.score || result.fake_probability} label={result.label} />
                    ) : (
                      <div className="h-32 flex items-center justify-center text-slate-600 text-xs uppercase">
                        Risk assessment pending
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "History" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: BEZIER }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <motion.div {...FADE_UP}>
                    <h2 className="text-2xl font-black tracking-tight">Analysis History</h2>
                    <p className="text-slate-400 text-sm">Review forensic logs and past classification reports.</p>
                  </motion.div>
                  <motion.button
                    whileHover={{ rotate: 180, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onClick={loadHistory}
                    className="p-2 hover:bg-white/5 rounded-full transition"
                  >
                    <Activity size={18} className={isLoadingHistory ? "animate-spin text-blue-500" : ""} />
                  </motion.button>
                </div>

                {isLoadingHistory ? (
                  <div className="h-64 flex items-center justify-center text-slate-500 italic">
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      Loading history logs...
                    </motion.span>
                  </div>
                ) : historyItems.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl"
                  >
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Media ID</th>
                          <th className="px-6 py-4 font-semibold">Timestamp</th>
                          <th className="px-6 py-4 font-semibold">Verdict</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        <AnimatePresence mode="popLayout">
                          {historyItems.map((item, idx) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ delay: idx * 0.04, ease: BEZIER }}
                              className="hover:bg-white/5 transition-colors group cursor-default"
                            >
                              <td className="px-6 py-4 font-mono text-xs text-slate-300">#{item?.id?.slice(-8) || "N/A"}</td>
                              <td className="px-6 py-4 text-slate-400">
                                <div className="flex items-center gap-2">
                                  <Clock size={12} className="text-slate-500" />
                                  {item?.timestamp ? new Date(item.timestamp).toLocaleString() : "Unknown"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-block ${
                                    item.label === 'REAL' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                  {item.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <motion.button
                                    whileHover={{ x: 3 }}
                                    onClick={() => viewHistoryItem(item)}
                                    className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold text-xs uppercase"
                                >
                                  Load Report <ExternalLink size={12} />
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-white/5 border-dashed p-20 text-center text-slate-600"
                  >
                      <History size={40} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm">No analysis history found in the secure vault.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT : AI EXPLANATION */}
        <motion.aside
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: BEZIER, delay: 0.2 }}
          className="border-l border-white/10 px-6 py-8 overflow-y-auto bg-black/20"
        >
          <h3 className="text-xs text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle2 size={12} className="text-emerald-500" /> AI Explanation
          </h3>

          <motion.div
            layout
            className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm space-y-4 shadow-xl"
          >
            {result?.metadata?.reason ? (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-200 leading-relaxed italic"
                >
                  "{typedText || "Analysing forensic signals…"}"
                </motion.p>

                {result.metadata?.regions?.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">
                      Influential Regions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {result.metadata.regions.map((r, idx) => (
                          <motion.span
                            key={r}
                            initial={{ scale: 0.8, opacity: 0, x: -5 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            transition={{ delay: idx * 0.1 }}
                            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 cursor-default"
                          >
                              {r}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-white/10 flex items-center justify-between"
                >
                  <span className="text-[10px] uppercase text-slate-500">Uncertainty</span>
                  <motion.span
                    key={result.metadata?.uncertainty}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-blue-400 font-mono"
                  >
                    {result.metadata?.uncertainty || "N/A"}
                  </motion.span>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-500 text-xs text-center py-10"
              >
                <Cpu size={24} className="mx-auto mb-3 opacity-20 animate-pulse" />
                Explanation engine idle. <br/>Upload media to begin.
              </motion.div>
            )}
          </motion.div>
        </motion.aside>
      </div>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="h-8 border-t border-white/10 flex items-center justify-between px-6 text-[9px] text-slate-500 tracking-[0.2em] font-bold bg-black"
      >
        <div className="flex items-center gap-2">
          <Cpu size={12} className="text-blue-500" /> CORE: VISION-X1 PRO
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          </span>
          SECURE CONNECTION ESTABLISHED
        </div>
      </motion.footer>
    </div>
  );
}