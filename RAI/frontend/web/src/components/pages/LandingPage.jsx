import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home, 
  Activity, 
  Flame, 
  Utensils, 
  User, 
  UserPlus, 
  Shield, 
  FileText 
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleCTA = () => {
    navigate(isLoggedIn ? "/dashboard" : "/profile");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/workout", label: "Workouts", icon: <Activity size={20} /> },
    { path: "/running", label: "Running", icon: <Flame size={20} /> },
    { path: "/food", label: "Nutrition", icon: <Utensils size={20} /> },
    { path: "/profile", label: "Login / Profile", icon: <User size={20} /> },
    { path: "/register", label: "Register", icon: <UserPlus size={20} /> },
    { path: "/privacy-policy", label: "Privacy Policy", icon: <Shield size={20} /> },
    { path: "/tos", label: "Terms of Service", icon: <FileText size={20} /> },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#2b2b2b] text-[#f2f2f2] font-sans overflow-hidden">
      
      {/* Navbar - Positioned absolute and z-50 to ensure it is always clickable */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-6 z-50">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-[#f2f2f2] hover:text-[#00a97f] transition-colors p-2 cursor-pointer outline-none flex items-center justify-center"
          aria-label="Open Menu"
        >
          <Menu size={36} strokeWidth={2.5} />
        </button>

        <Link
          to="/profile"
          className="text-lg font-bold text-[#f2f2f2] hover:text-[#00a97f] transition-colors px-4 py-2 uppercase tracking-wide cursor-pointer"
        >
          Login
        </Link>
      </header>

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

      {/* Drawer Menu */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] cursor-pointer"
            />

            {/* Sidebar (Using Card Color to contrast dark background) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-[#413f4f] text-[#f2f2f2] shadow-2xl z-[70] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 flex items-center justify-between border-b border-[#2b2b2b]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black tracking-widest text-[#00a97f]">
                    GYMMER
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-[#c5c5c5] hover:text-[#ffffff] transition-colors p-1 cursor-pointer"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 scrollbar-hide">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#2b2b2b] transition-colors text-lg font-medium group"
                  >
                    <span className="text-[#00a97f] group-hover:text-[#ffffff] transition-colors">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Sidebar Footer CTA */}
              <div className="p-6 border-t border-[#2b2b2b]">
                <Link
                  to="/profile"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full flex items-center justify-center gap-3 bg-[#2b2b2b] hover:bg-[#00a97f] text-[#ffffff] py-4 rounded-xl transition-colors font-bold text-lg cursor-pointer"
                >
                  <User size={22} />
                  {isLoggedIn ? "My Profile" : "Sign In"}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}