import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({ title, lastUpdated, children }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] p-6 overflow-hidden">
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl z-10 flex flex-col max-h-[90vh]"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="bg-[var(--background)] border border-[var(--border)] p-8 rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)] shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl text-[var(--text-primary)] font-bold tracking-wide">{title}</h2>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center p-2 rounded-xl bg-[var(--surface-dark)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto pr-4 space-y-6 text-[var(--muted)] text-sm leading-relaxed custom-scrollbar">
            {lastUpdated && <p><strong>{lastUpdated}</strong></p>}
            {children}
          </div>

        </div>
      </motion.div>

      {/* Global CSS for the custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--surface-dark);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
      `}} />
    </div>
  );
}