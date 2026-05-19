import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Weight, Target, Activity, User, Heart, Settings, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    targetWeight: '',
    age: '',
    sex: 'male',
    activityLevel: 'sedentary',
    goalType: 'maintain_weight',
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funkcija za čiščenje FastAPI napak
  const parseError = (data) => {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
      const err = data.detail[0];
      const field = err.loc[err.loc.length - 1];
      
      const fieldNames = {
        height_cm: "Višina",
        weight_kg: "Teža",
        goal_weight_kg: "Ciljna teža",
        age: "Starost"
      };

      return `${fieldNames[field] || field}: ${err.msg}`;
    }
    return "Prišlo je do nepredvidene napake.";
  };

  const validateInputs = () => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    const tw = parseFloat(formData.targetWeight);
    const a = parseInt(formData.age);

    if (h < 100 || h > 250) return "Height must be between 100 cm and 250 cm.";
    if (w < 40 || w > 300) return "Weight must be between 40 kg and 300 kg.";
    if (tw < 40 || tw > 300) return "Goal weight must be between 40 kg and 300 kg.";
    if (a < 15 || a > 99) return "Age must be between 15 and 99 years.";

    // Dodatna logika: Če želi shujšati, mora biti ciljna teža manjša od trenutne
    if (formData.goalType === 'lose_weight' && tw >= w) {
      return "For weight loss, goal weight must be lower than current weight.";
    }
    // Če se želi zrediti, mora biti ciljna teža večja
    if (formData.goalType === 'gain_weight' && tw <= w) {
      return "For weight gain, goal weight must be higher than current weight.";
    }

    return null; // Vse je v redu
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Najprej preverimo, če so vneseni podatki logični
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const payload = {
      height_cm: parseFloat(formData.height),
      weight_kg: parseFloat(formData.weight),
      goal_weight_kg: parseFloat(formData.targetWeight),
      age: parseInt(formData.age),
      sex: formData.sex,
      activity_level: formData.activityLevel,
      goal_type: formData.goalType
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/users/me/profile", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}` 
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(parseError(responseData));
        setLoading(false);
        return;
      }

      // Uspešno posodobljeno!
      navigate('/food'); 
      
    } catch (err) {
      console.error("Network Fetch Error:", err);
      setError("Network error: Make sure your backend (uvicorn) is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_var(--surface)_0%,_var(--background)_45%,_var(--surface-dark)_100%)] overflow-x-hidden px-4 pt-24 pb-12 text-[var(--text-primary)]">
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full max-w-2xl z-10"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-dark)]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
          
          <div className="mb-7 text-left">
            <h2 className="mb-2 font-['Chopsic'] text-3xl font-normal tracking-wide text-[var(--text-primary)] sm:text-4xl">Complete Profile</h2>
            <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">Fill in all details to sync with Gymmer's backend.</p>
          </div>

          {/* Prikaz napak nad obrazcem */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Height & Weight */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                  <input type="number" name="height" value={formData.height} onChange={handleChange} required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" placeholder="180" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" placeholder="75" />
                </div>
              </div>
            </div>

            {/* Target Weight & Age */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Goal Weight (kg)</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                  <input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" placeholder="70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Age</label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" placeholder="25" />
                </div>
              </div>
            </div>

            {/* Sex Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Sex</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 appearance-none [color-scheme:dark]">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Activity Level</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 appearance-none [color-scheme:dark]">
                  <option value="sedentary">Sedentary (No exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (Physical job/2x training)</option>
                </select>
              </div>
            </div>

            {/* Goal Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Primary Goal</label>
              <div className="relative">
                <Settings className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                <select name="goalType" value={formData.goalType} onChange={handleChange} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 pl-11 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--muted)]/60 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 appearance-none [color-scheme:dark]">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className={`mt-6 w-full rounded-2xl bg-[var(--accent)] py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-[var(--text-inverse)] shadow-[0_0_22px_rgba(0,169,127,0.35)] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-[var(--accent-hover)] hover:shadow-[0_0_30px_rgba(0,169,127,0.55)]'}`}
            >
              {loading ? 'SAVING...' : 'COMPLETE SETUP'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}