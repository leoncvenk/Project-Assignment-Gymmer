import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navigation from "../ui/Navigation"; // Adjust path if needed

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleCTA = () => {
    navigate(isLoggedIn ? "/dashboard" : "/profile");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#2b2b2b] text-[#f2f2f2] font-sans overflow-hidden">
      
      {/* Global Navigation Component */}
      <Navigation />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 text-center z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center max-w-5xl"
        >

          {/* Typography */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.1] text-[#ffffff] mb-6">
            YOUR ULTIMATE <br />
            <span className="text-[#00a97f]">WORKOUT</span> COMPANION
          </h1>

          <p className="text-lg md:text-xl text-[#c5c5c5] max-w-2xl mb-12 font-medium tracking-wide">
            Everything you need in one app. Plan your routines, track your runs, and monitor your nutrition seamlessly.
          </p>

          {/* Primary CTA */}
          <motion.button
            onClick={handleCTA}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00a97f] hover:bg-[#008a68] text-[#ffffff] text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative z-20"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}