import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleGoToDashboard = () => {
    navigate(isLoggedIn ? "/dashboard" : "/profile");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[var(--background)] overflow-hidden">
      {/* Center Text Area */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="group flex flex-col items-center justify-center text-center select-none transition-all duration-500 drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_30px_var(--accent)]"
        >
          <h1 
            className="text-7xl sm:text-8xl md:text-[130px] leading-none tracking-wide m-0 text-[var(--text-primary)]"
            style={{ fontFamily: 'Chopsic, sans-serif' }}
          >
            GYMMER
          </h1>

          <p
            className="text-sm sm:text-xl md:text-1xl uppercase tracking-[0.3em] text-[var(--muted)] font-medium transition-colors duration-300 group-hover:text-[var(--accent)]"
            style={{ fontFamily: 'Chopsic, sans-serif' }}
          >
            Everything you need in one app
          </p>

          <motion.button
            type="button"
            onClick={handleGoToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 px-8 py-3 rounded-full bg-[var(--accent)] text-black text-sm font-bold uppercase tracking-[0.18em] shadow-lg hover:opacity-90 transition-opacity"
          >
            {isLoggedIn ? "Go to dashboard" : "Sign in or register"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}