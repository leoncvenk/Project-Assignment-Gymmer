import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Mail, Sparkles } from "lucide-react";

const GoogleIcon = (props) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
);
const AppleIcon = (props) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
);

export default function AuthPage() {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const dockItems = [
    { path: "/", icon: "fi fi-rr-home" },
    { path: "/profile", icon: "fi fi-rs-user" },
    { path: "/food", icon: "fi fi-rr-restaurant" },
    { path: "/running", icon: "fi fi-rr-running" },
    { path: "/workout", icon: "fi fi-rr-gym" },
  ];

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    console.log("POST /auth/login", response.status, data);

    if (!response.ok) {
      alert(
        `POST /auth/login ${response.status}: ` +
        (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))
      );
      return;
    }

    localStorage.setItem("access_token", data.access_token);

    alert("Login successful");
  } catch (error) {
    console.error("POST /auth/login error:", error);
    alert(`POST /auth/login error: ${error.message}`);
  }
};

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden">
      
      {/* Floating Dock */}
      <motion.nav 
        className="absolute top-5 px-10 py-4 bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl flex items-center gap-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/5 z-50"
      >
        {dockItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`transition-all duration-200 flex items-center justify-center p-3 rounded-xl active:scale-95 ${
                isActive 
                  ? "bg-[#484848] text-white shadow-[0_0_20px_rgba(75,75,75,0.4)] hover:scale-120" 
                  : "text-gray-300 hover:text-white hover:scale-200"
              }`}
            >
              <i className={`${item.icon} text-xl flex items-center h-full leading-none`} />
            </Link>
          );
        })}
      </motion.nav>

      {/* Main Content: Auth Form */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full max-w-md px-6 mt-20 lg:mt-0 z-10"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full">
          
          <div className="text-left mb-8">
            <h2 className="text-3xl text-white font-bold tracking-wide mb-2">Sign in to Gymmer</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Log in to track your macros, sync your workouts, and hit your daily goals.
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Sign-in */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Sign in with</label>
              <div className="grid grid-cols-2 gap-5">
                <button className="cursor-pointer flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <GoogleIcon className="w-5 h-5" />
                </button>
                <button className="cursor-pointer flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <AppleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="jdoe@example.com" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm text-gray-300">Password</label>
                  <a href="#" className="text-sm text-blue-500 hover:text-blue-400 hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    required 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold tracking-wide mt-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
              >
                SIGN IN
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Changed from <button> to <Link> and added the 'to' prop */}
            <Link 
              to="/register" 
              className="cursor-pointer flex items-center text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Sparkles className="mr-2 h-4 w-4 text-blue-400" />
              Or create an account
            </Link>
            
            <p className="text-xs text-gray-500 text-center mt-2 leading-relaxed">
              By logging in, you agree to our{' '}
              <a href="#" className="text-gray-400 underline hover:text-white transition-colors">Terms of Service</a>
              {' '}&{' '}
              <a href="#" className="text-gray-400 underline hover:text-white transition-colors">Privacy Policy</a>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}