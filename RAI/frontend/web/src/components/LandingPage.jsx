import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const location = useLocation();
  const dockItems = [
    { path: "/", icon: "fi fi-rr-home" },
    { path: "/profile", icon: "fi fi-rs-user" },
    { path: "/food", icon: "fi fi-rr-restaurant" },
    { path: "/running", icon: "fi fi-rr-running" },
    { path: "/workout", icon: "fi fi-rr-gym" },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-hidden">

      {/* Center Text Area */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
        
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="group flex flex-col items-center justify-center text-center select-none transition-all duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <h1 
            className="text-7xl sm:text-8xl md:text-[130px] leading-none tracking-wide m-0 text-metallic"
            style={{ fontFamily: 'Chopsic, sans-serif' }}
          >
            GYMMER
          </h1>

          <p className="text-sm sm:text-xl md:text-1xl uppercase tracking-[0.3em] text-[#FFFFFF] font-medium transition-colors duration-100 group-hover:text-white"
             style={{ fontFamily: 'Chopsic, sans-serif' }}
          >
            
            Everything you need in one app
          </p>
        </motion.div>

      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5}}
        className="absolute bottom-8 flex flex-col items-center justify-center text-gray-400 animate-bounce"
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m7 6 5 5 5-5" />
          <path d="m7 13 5 5 5-5" />
        </svg>
      </motion.div>

    </div>
  );
}