import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';

export default function SecurityTab() {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // POPRAVEK: Vsako polje ima svoje stanje za prikaz gesla
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError(null);
  };

  // Funkcija za preklop posameznega polja
  const toggleVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/change-password", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Failed to update password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-12">
        
        <div className="flex-1 space-y-6">
          <div className="text-left">
            <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide">Security & Password</h3>
            <p className="text-[var(--muted)] text-sm mt-1">Ensure your new password is strong and secure.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" /><span>{error}</span>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/50 text-[var(--accent)] p-3 rounded-xl text-sm flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" /><span>Password updated successfully!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "Current Password", name: "currentPassword", key: "current" },
              { label: "New Password", name: "newPassword", key: "new" },
              { label: "Verify New Password", name: "confirmPassword", key: "confirm" }
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs text-[var(--muted)]">{field.label}</label>
                <div className="relative mt-1">
                  <input 
                    type={showPassword[field.key] ? "text" : "password"} 
                    name={field.name} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                    required 
                    className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-3 px-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-all" 
                  />
                  <button 
                    type="button" 
                    onClick={() => toggleVisibility(field.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            
            <motion.button 
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              type="submit" 
              disabled={loading} 
              className={`bg-[var(--accent)] text-[var(--text-inverse)] px-8 py-3 rounded-xl text-sm font-bold mt-2 transition-all w-full md:w-auto ${loading ? 'opacity-50' : 'hover:bg-[var(--accent-hover)] cursor-pointer'}`}
            >
              {loading ? 'UPDATING...' : 'Update Password'}
            </motion.button>
          </form>
        </div>

        <div className="w-full lg:w-80 bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-6 h-fit">
          <h4 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--accent)]" /> Security Tips
          </h4>
          <ul className="text-sm text-[var(--muted)] space-y-4 list-none">
            <li>• Use at least 8 characters.</li>
            <li>• Mix letters, numbers, and symbols.</li>
            <li>• Do not reuse old passwords.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}