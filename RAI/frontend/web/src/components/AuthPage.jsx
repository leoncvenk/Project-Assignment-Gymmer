import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Settings, Shield, ThumbsUp, Lightbulb, Dumbbell } from "lucide-react";

const GoogleIcon = (props) => (
  <img src="https://svgl.app/library/google.svg" alt="Google" {...props} />
);
const AppleIcon = (props) => (
  <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" {...props} />
);

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          `POST /auth/login ${response.status}: ` +
          (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail))
        );
        return;
      }

      localStorage.setItem("access_token", data.access_token);

      const meResponse = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      const meData = await meResponse.json();

      if (!meResponse.ok) {
        alert("Failed to fetch current user");
        return;
      }

      if (meData.profile_completed) {
        navigate("/dashboard");
      } else {
        navigate("/profile-setup");
      }
    } catch (error) {
      alert(`POST /auth/login error: ${error.message}`);
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
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--background)]">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[450px] bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl"
        >
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Sign in</h1>
          
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-[var(--muted)]">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="your@email.com" 
                className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                required 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm text-[var(--muted)]">Password</label>
                <Link to="/forgot-password" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••"
                  className="w-full bg-transparent border border-[var(--border)] rounded-xl py-2.5 px-3.5 pr-10 text-[var(--text-primary)] placeholder:text-[var(--border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 pb-2">
              <input type="checkbox" id="remember" className="rounded border-[var(--border)] bg-transparent text-[var(--accent)] focus:ring-[var(--accent)] h-4 w-4" />
              <label htmlFor="remember" className="text-sm text-[var(--muted)]">Remember me</label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don't have an account? <Link to="/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">Sign up</Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[var(--border)]"></div>
            <span className="px-3 text-sm text-[var(--muted)]">or</span>
            <div className="flex-1 border-t border-[var(--border)]"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--text-primary)] cursor-pointer">
              <GoogleIcon className="w-4 h-4" />
              Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-[var(--border)] rounded-xl hover:bg-[var(--surface)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--text-primary)] cursor-pointer">
              <AppleIcon className="w-4 h-4" />
              Sign in with Apple
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}