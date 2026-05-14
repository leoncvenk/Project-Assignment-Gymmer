import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { Eye, EyeOff, KeyRound, Mail, Sparkles, User, Calendar, Phone, AtSign, AlertCircle } from "lucide-react";

const GoogleIcon = (props) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
);
const AppleIcon = (props) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseError = (data) => {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      const err = data.detail[0];
      const field = err.loc[err.loc.length - 1];
      
      const fieldNames = {
        username: "Uporabniško ime",
        email: "E-poštni naslov",
        password: "Geslo"
      };

      if (err.type === "string_too_short") {
        return `${fieldNames[field] || field} mora imeti vsaj ${err.ctx.min_length} znakov.`;
      }
      if (err.type === "value_error.email") {
        return "Vnesite veljaven e-poštni naslov.";
      }
      return err.msg;
    }
    return "Prišlo je do nepredvidene napake.";
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.repeatPassword) {
      setError("Gesli se ne ujemata.");
      setLoading(false);
      return;
    }

    try {
      // 1. KORAK: Registracija
      const registerResponse = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(parseError(registerData));
        setLoading(false);
        return;
      }

      // 2. KORAK: Avtomatska prijava (če je bila registracija uspešna)
      const loginResponse = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password, 
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // Shranimo žeton v brskalnik
        localStorage.setItem("access_token", loginData.access_token);
        
        // Ker gre za novega uporabnika, ga vržemo direktno na izpolnjevanje profila
        navigate('/profile-setup'); 
      } else {
        // Če bi se pri avtomatski prijavi karkoli zalomilo, ga pošljemo na ročno prijavo
        navigate('/profile'); 
      }

    } catch (error) {
      setError("Ni povezave z zaledjem. Preveri, če tvoj uvicorn teče!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden pt-24 pb-6">

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

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
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

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] text-gray-500 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs text-gray-300">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input id="name" name="name" type="text" placeholder="John" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="surname" className="text-xs text-gray-300">Surname</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input id="surname" name="surname" type="text" placeholder="Doe" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-xs text-gray-300">Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input id="username" name="username" type="text" placeholder="johndoe99" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="birthdate" className="text-xs text-gray-300">Birthdate</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input id="birthdate" name="birthdate" type="date" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]" required />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input id="email" name="email" type="email" placeholder="jdoe@example.com" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs text-gray-300">Phone Number <span className="text-gray-600 text-[10px]">(Optional)</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs text-gray-300">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="repeatPassword" className="text-xs text-gray-300">Repeat Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input id="repeatPassword" name="repeatPassword" type={showRepeatPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors" required />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                      {showRepeatPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className={`w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold tracking-wide mt-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] cursor-pointer'}`}
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </motion.button>
            </form>
          </div>

          <div className="mt-5 flex flex-col items-center gap-3">
            <Link to="/profile" className="cursor-pointer flex items-center text-gray-400 hover:text-white transition-colors text-xs">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-blue-400" />
              Or sign in to your account
            </Link>
            <p className="text-[10px] text-gray-500 text-center leading-relaxed">
              By registering, you agree to our{' '}
              <Link to="/tos" className="text-gray-400 underline hover:text-white transition-colors">Terms of Service</Link>
              {' '}&{' '}
              <Link to="/privacy-policy" className="text-gray-400 underline hover:text-white transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}