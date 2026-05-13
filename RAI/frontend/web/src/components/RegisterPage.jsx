import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Mail, Sparkles, User, Calendar, Phone, AtSign } from "lucide-react";

const GoogleIcon = (props) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
);
const AppleIcon = (props) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
);

export default function RegisterPage() {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const dockItems = [
    { path: "/", icon: "fi fi-rr-home" },
    { path: "/profile", icon: "fi fi-rs-user" },
    { path: "/food", icon: "fi fi-rr-restaurant" },
    { path: "/running", icon: "fi fi-rr-running" },
    { path: "/workout", icon: "fi fi-rr-gym" },
  ];

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Registration Data:", data);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden pt-24 pb-6">
      
      {/* Floating Dock */}
      <motion.nav 
        className="fixed top-5 left-1/2 -translate-x-1/2 px-10 py-4 bg-[#2a2a2a]/90 backdrop-blur-sm rounded-2xl flex items-center gap-12 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/5 z-50"
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

      {/* Main Content: Register Form */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full max-w-lg px-6 z-10"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full">
          
          <div className="text-left mb-5">
            <h2 className="text-2xl text-white font-bold tracking-wide mb-1">Join Gymmer</h2>
            <p className="text-gray-400 text-xs leading-relaxed">
              Create an account to start tracking your macros, workouts, and daily goals.
            </p>
          </div>

          <div className="space-y-4">
            {/* Social Sign-up */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">Sign up with</label>
              <div className="grid grid-cols-2 gap-4">
                <button className="cursor-pointer flex items-center justify-center p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <GoogleIcon className="w-5 h-5" />
                </button>
                <button className="cursor-pointer flex items-center justify-center p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <AppleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] text-gray-500 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              
              {/* Row 1: Name & Surname */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs text-gray-300">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      id="name" name="name" type="text" placeholder="John" 
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="surname" className="text-xs text-gray-300">Surname</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      id="surname" name="surname" type="text" placeholder="Doe" 
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required 
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Username & Birthdate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-xs text-gray-300">Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      id="username" name="username" type="text" placeholder="johndoe99" 
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="birthdate" className="text-xs text-gray-300">Birthdate</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      id="birthdate" name="birthdate" type="date" 
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]" required 
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    id="email" name="email" type="email" placeholder="jdoe@example.com" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required 
                  />
                </div>
              </div>

              {/* Row 4: Phone Number (Optional) */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs text-gray-300">Phone Number <span className="text-gray-600 text-[10px]">(Optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                </div>
              </div>

              {/* Row 5: Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs text-gray-300">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required 
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="repeatPassword" className="text-xs text-gray-300">Repeat Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input 
                      id="repeatPassword" name="repeatPassword" type={showRepeatPassword ? "text" : "password"} placeholder="••••••••"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required 
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                      {showRepeatPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold tracking-wide mt-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all cursor-pointer"
              >
                CREATE ACCOUNT
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <Link to="/profile" className="cursor-pointer flex items-center text-gray-400 hover:text-white transition-colors text-xs">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-blue-400" />
              Or sign in to your account
            </Link>
            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              By registering, you agree to our{' '}
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