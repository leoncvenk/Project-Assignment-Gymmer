import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion"; 
import { AlertCircle } from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import FormInput from "../ui/FormInput";
import PasswordInput from "../ui/PasswordInput";
import SocialAuth from "../ui/SocialAuth";
import Navigation from "../ui/Navigation";

export default function RegisterPage() {
  const navigate = useNavigate();
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
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: data.username, email: data.email, password: data.password }),
      });
      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(parseError(registerData));
        setLoading(false);
        return;
      }

      const loginResponse = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.email, password: data.password }),
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
    <>
      <Navigation />
      <AuthLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-[500px] bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl relative z-10 mt-16">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Sign up</h1>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="First Name" id="name" placeholder="John" required />
              <FormInput label="Last Name" id="surname" placeholder="Doe" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Username" id="username" placeholder="johndoe" required />
              <FormInput label="Birthdate" id="birthdate" type="date" required />
            </div>
            <FormInput label="Email" id="email" type="email" placeholder="your@email.com" required />
            <FormInput label="Phone" id="phone" type="tel" placeholder="+1 (555) 000-0000" optional />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <PasswordInput label="Password" id="password" />
              <PasswordInput label="Repeat Password" id="repeatPassword" />
            </div>
            <button type="submit" disabled={loading} className={`w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] font-medium py-2.5 rounded-xl transition-colors mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>
          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Already have an account? <Link to="/profile" className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline transition-colors">Sign in</Link>
          </p>
          <SocialAuth mode="Sign up" />
        </motion.div>
      </AuthLayout>
    </>
  );
}