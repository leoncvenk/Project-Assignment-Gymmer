import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const dockItems = [
    { path: "/", icon: "fi fi-rr-home" },
    { path: "/profile", icon: "fi fi-rs-user" },
    { path: "/food", icon: "fi fi-rr-restaurant" },
    { path: "/running", icon: "fi fi-rr-running" },
    { path: "/workout", icon: "fi fi-rr-gym" },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-hidden">
      
      {/* Floating Dock */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="absolute top-5 px-10 py-5 bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl flex items-center gap-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/5"
      >
        {dockItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="text-gray-300 transition-all duration-200 hover:text-white hover:scale-200 active:scale-95 flex items-center justify-center"
          >
            <i className={`${item.icon} text-xl flex items-center h-full leading-none`} />
          </Link>
        ))}
      </motion.nav>

      {/* Center Text Area */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
        
        {/* We apply the glow and hover scale to this wrapper, NOT the text directly! */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer group flex flex-col items-center justify-center text-center select-none transition-all duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <h1 
            className="text-7xl sm:text-8xl md:text-[130px] leading-none text-metallic"
            style={{ fontFamily: 'Chopsic, sans-serif' }}
          >
            GYMMER
          </h1>

          <p className="text-sm sm:text-xl md:text-2xl uppercase tracking-[0.3em] text-[#a6a6a6] mt-4 font-medium transition-colors duration-500 group-hover:text-white">
            Everything you need in one app
          </p>
        </motion.div>

      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
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