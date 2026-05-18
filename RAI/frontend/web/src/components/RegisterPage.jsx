import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { Eye, EyeOff, Settings, Shield, ThumbsUp, Lightbulb, Dumbbell, AlertCircle } from "lucide-react";

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
      const fieldNames = { username: "Uporabniško ime", email: "E-poštni naslov", password: "Geslo" };
      if (err.type === "string_too_short") return `${fieldNames[field] || field} mora imeti vsaj ${err.ctx.min_length} znakov.`;
      if (err.type === "value_error.email") return "Vnesite veljaven e-poštni naslov.";
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

      const loginResponse = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem("access_token", loginData.access_token);
        navigate('/profile-setup'); 
      } else {
        navigate('/profile'); 
      }
    } catch (err) {
      console.error("Network Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] font-sans">
      {/* Left Side - Information Panel */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 lg:px-24 xl:px-32 2xl:px-48 bg-[var(--background)]">
        <div className="flex items-center gap-2 mb-12">
          <Dumbbell className="text-[var(--accent)] h-6 w-6" />
          <span className="text-xl font-semibold text-[var(--text-primary)]">Gymmer</span>
        </div>

        <div className="space-y-10">
          <div className="flex gap-4">
            <Settings className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Adaptable performance</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Our product effortlessly adjusts to your needs, boosting efficiency and simplifying your tasks.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Shield className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Built to last</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Experience unmatched durability that goes above and beyond with lasting investment.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <ThumbsUp className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Great user experience</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Integrate our product into your routine with an intuitive and easy-to-use interface.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Lightbulb className="text-[var(--accent)] h-6 w-6 shrink-0 mt-1" />
            <div>
              <h3 className="text-[var(--text-primary)] font-medium mb-1">Innovative functionality</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Stay ahead with features that set new standards, addressing your evolving needs better than the rest.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--background)] py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[500px] bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl"
        >
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Sign up</h1>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm text-[var(--muted)]">First Name</label>
                <input id="name" name="name" type="text" placeholder="John" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="surname" className="block text-sm text-[var(--muted)]">Last Name</label>
                <input id="surname" name="surname" type="text" placeholder="Doe" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm text-[var(--muted)]">Username</label>
                <input id="username" name="username" type="text" placeholder="johndoe" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="birthdate" className="block text-sm text-[var(--muted)]">Birthdate</label>
                <input id="birthdate" name="birthdate" type="date" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all [color-scheme:dark]" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm text-[var(--muted)]">Email</label>
              <input id="email" name="email" type="email" placeholder="your@email.com" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" required />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm text-[var(--muted)]">Phone <span className="text-[var(--border)]">(Optional)</span></label>
              <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm text-[var(--muted)]">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="repeatPassword" className="block text-sm text-[var(--muted)]">Repeat Password</label>
                <div className="relative">
                  <input id="repeatPassword" name="repeatPassword" type={showRepeatPassword ? "text" : "password"} placeholder="••••••" className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all" required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                    {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account? <Link to="/profile" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">Sign in</Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[var(--border)]"></div>
            <span className="px-3 text-sm text-[var(--muted)]">or</span>
            <div className="flex-1 border-t border-[var(--border)]"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--text-primary)] cursor-pointer">
              <GoogleIcon className="w-4 h-4" />
              Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--text-primary)] cursor-pointer">
              <AppleIcon className="w-4 h-4" />
              Sign up with Apple
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}