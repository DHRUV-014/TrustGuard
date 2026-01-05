import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileCode, ShieldAlert } from "lucide-react";

const UploadZone = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      onUpload(file);
    }
  };

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      onClick={() => fileInputRef.current?.click()}
      whileHover={{ scale: 1.01, borderColor: "rgba(59, 130, 246, 0.5)" }}
      whileTap={{ scale: 0.99 }}
      className={`relative group mt-8 aspect-[21/9] w-full rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden
        ${isDragging
          ? "border-blue-500 bg-blue-500/10"
          : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
        }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Decorative Noise/Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <motion.div
        animate={isDragging ? { y: -10 } : { y: 0 }}
        className={`p-5 rounded-3xl border transition-all duration-300 mb-4
          ${isDragging
            ? "bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            : "bg-white/[0.03] border-white/[0.08] group-hover:border-blue-500/50 group-hover:bg-blue-500/10"
          }`}
      >
        <Upload
          size={32}
          className={isDragging ? "text-white" : "text-slate-500 group-hover:text-blue-400"}
        />
      </motion.div>

      <div className="text-center z-10">
        <p className="text-sm font-semibold text-slate-300 tracking-tight">
          {isDragging ? "Drop to initiate scan" : "Drop forensic source or click to browse"}
        </p>

        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
            <FileCode size={12} /> H.264 / RAW
          </span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
            <ShieldAlert size={12} /> Metadata-Safe
          </span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*,video/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </motion.div>
  );
};

export default UploadZone;