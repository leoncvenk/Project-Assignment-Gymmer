import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layout/AuthLayout";
import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import SocialAuth from "../ui/SocialAuth";
import Navigation from "../ui/Navigation";

export default function AuthPage() {
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`POST /auth/login ${response.status}: ` + (typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail)));
        return;
      }
      localStorage.setItem("access_token", data.access_token);
      const meResponse = await fetch("http://127.0.0.1:8000/auth/me", { headers: { Authorization: `Bearer ${data.access_token}` } });
      const meData = await meResponse.json();
      if (!meResponse.ok) return alert("Failed to fetch current user");
      
      if (meData.profile_completed) navigate("/dashboard");
      else navigate("/profile-setup");
    } catch (error) {
      alert(`POST /auth/login error: ${error.message}`);
    }
  };

  return (
    <>
      <Navigation />
      <AuthLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[450px] bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 mt-16">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Sign in</h1>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <FormInput label="Email" id="email" type="email" placeholder="your@email.com" required />
            <PasswordInput label="Password" id="password" action={<Link to="/forgot-password" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">Forgot your password?</Link>} />
            <div className="flex items-center gap-2 pt-1 pb-2">
              <input type="checkbox" id="remember" className="rounded border-[var(--border)] bg-transparent text-[var(--accent)] focus:ring-[var(--accent)] h-4 w-4" />
              <label htmlFor="remember" className="text-sm text-[var(--muted)]">Remember me</label>
            </div>
            <button type="submit" className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors cursor-pointer">Sign in</button>
          </form>
          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don't have an account? <Link to="/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">Sign up</Link>
          </p>
          <SocialAuth mode="Sign in" />
        </motion.div>
      </AuthLayout>
    </>
  );
}