import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Activity, Flame, Utensils, User, UserPlus, Shield, FileText } from "lucide-react";

export default function Navigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("access_token");

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
    <>
      {/* Absolute Navbar for all pages */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-6 z-50 pointer-events-auto">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-[#f2f2f2] hover:text-[#00a97f] transition-colors p-2 cursor-pointer outline-none flex items-center justify-center bg-[#2b2b2b]/50 rounded-lg backdrop-blur-sm"
          aria-label="Open Menu"
        >
          <Menu size={36} strokeWidth={2.5} />
        </button>
      </header>

      {/* Drawer Menu */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] cursor-pointer"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-[#2b2b2b] text-[#f2f2f2] shadow-2xl z-[70] flex flex-col"
            >
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

              <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 scrollbar-hide">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsDrawerOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors text-lg font-medium group ${
                        isActive 
                          ? "bg-[#00a97f] text-[#ffffff] shadow-md" 
                          : "hover:bg-[#2b2b2b] text-[#f2f2f2]"
                      }`}
                    >
                      <span className={`${isActive ? "text-[#ffffff]" : "text-[#00a97f] group-hover:text-[#ffffff]"} transition-colors`}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

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
    </>
  );
}