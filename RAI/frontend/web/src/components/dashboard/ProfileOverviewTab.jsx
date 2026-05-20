import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Weight, Target, Heart, User, Activity, Settings, AlertCircle, CheckCircle } from 'lucide-react';

export default function ProfileOverviewTab({ userData, setUserData }) {
  const [editFormData, setEditFormData] = useState({
    height: userData?.profile?.height_cm || '',
    weight: userData?.profile?.weight_kg || '',
    targetWeight: userData?.profile?.goal_weight_kg || '',
    age: userData?.profile?.age || '',
    sex: userData?.profile?.sex || 'male',
    activityLevel: userData?.profile?.activity_level || 'sedentary',
    goalType: userData?.profile?.goal_type || 'maintain_weight'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const validateInputs = () => {
    const h = parseFloat(editFormData.height);
    const w = parseFloat(editFormData.weight);
    const tw = parseFloat(editFormData.targetWeight);
    const a = parseInt(editFormData.age);

    if (h < 100 || h > 250) return "Height must be between 100 cm and 250 cm.";
    if (w < 40 || w > 300) return "Weight must be between 40 kg and 300 kg.";
    if (tw < 40 || tw > 300) return "Goal weight must be between 40 kg and 300 kg.";
    if (a < 15 || a > 99) return "Age must be between 15 and 99 years.";
    if (editFormData.goalType === 'lose_weight' && tw >= w) return "For weight loss, goal weight must be lower than current weight.";
    if (editFormData.goalType === 'gain_weight' && tw <= w) return "For weight gain, goal weight must be higher than current weight.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateInputs();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    const payload = {
      height_cm: parseFloat(editFormData.height), weight_kg: parseFloat(editFormData.weight),
      goal_weight_kg: parseFloat(editFormData.targetWeight), age: parseInt(editFormData.age),
      sex: editFormData.sex, activity_level: editFormData.activityLevel, goal_type: editFormData.goalType
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

      if (!response.ok) {
        setError("Failed to update profile. Please try again.");
        setLoading(false);
        return;
      }
      setUserData(prev => ({ ...prev, profile: payload }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      
      {/* 1. DEL: PREGLED (OVERVIEW) */}
      <div>
        <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide mb-4">My Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Height", value: userData?.profile?.height_cm || "?", unit: "cm", icon: Ruler },
            { label: "Weight", value: userData?.profile?.weight_kg || "?", unit: "kg", icon: Weight },
            { label: "Goal", value: userData?.profile?.goal_weight_kg || "?", unit: "kg", icon: Target },
            { label: "Activity", value: userData?.profile?.activity_level?.replace('_', ' ') || "?", unit: "", icon: Activity }
          ].map((stat, i) => (
            <div key={i} className="bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <stat.icon className="h-6 w-6 text-[var(--accent)] mb-2" />
              <span className="text-xs text-[var(--muted)] uppercase tracking-wider">{stat.label}</span>
              <span className="text-xl text-[var(--text-primary)] font-bold mt-1 capitalize">
                {stat.value} <span className="text-sm font-normal text-[var(--muted)]">{stat.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-[var(--border)] opacity-50"></div>

      {/* 2. DEL: UREJANJE PROFILA */}
      <div>
        <div className="text-left mb-6">
          <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide">Edit Profile</h3>
          <p className="text-[var(--muted)] text-sm mt-1">Update your personal information and goals.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm flex items-center gap-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /><span>{error}</span>
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
              <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/50 text-[var(--accent)] p-3 rounded-xl text-sm flex items-center gap-3">
                <CheckCircle className="h-4 w-4 flex-shrink-0" /><span>Profile updated successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <input type="number" name="height" value={editFormData.height} onChange={handleChange} required className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">Weight (kg)</label>
              <div className="relative">
                <Weight className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <input type="number" name="weight" value={editFormData.weight} onChange={handleChange} required className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">Goal Weight (kg)</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <input type="number" name="targetWeight" value={editFormData.targetWeight} onChange={handleChange} required className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">Age</label>
              <div className="relative">
                <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <input type="number" name="age" value={editFormData.age} onChange={handleChange} required className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">Sex</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <select name="sex" value={editFormData.sex} onChange={handleChange} className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--muted)]">Primary Goal</label>
              <div className="relative">
                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
                <select name="goalType" value={editFormData.goalType} onChange={handleChange} className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[var(--muted)]">Activity Level</label>
            <div className="relative">
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted)]" />
              <select name="activityLevel" value={editFormData.activityLevel} onChange={handleChange} className="w-full bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none">
                <option value="sedentary">Sedentary (No exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (Physical job/2x training)</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className={`w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] py-3 rounded-xl text-sm font-bold mt-4 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-lg shadow-[var(--accent)]/20'}`}
          >
            {loading ? 'SAVING...' : 'SAVE CHANGES'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}