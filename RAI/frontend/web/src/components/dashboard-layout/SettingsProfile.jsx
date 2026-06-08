import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsProfile({ userData, setUserData }) {
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateInputs();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    const payload = {
      height_cm: parseFloat(editFormData.height), 
      weight_kg: parseFloat(editFormData.weight),
      goal_weight_kg: parseFloat(editFormData.targetWeight), 
      age: parseInt(editFormData.age),
      sex: editFormData.sex, 
      activity_level: editFormData.activityLevel, 
      goal_type: editFormData.goalType
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10">
      <form onSubmit={handleProfileSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2b2b2b]">Physical Profile</h2>
            <p className="text-sm text-[#c5c5c5] mt-1">Update your measurements and fitness goals.</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className={`px-5 py-2.5 text-sm font-semibold text-white bg-[#00a97f] rounded-xl hover:bg-[#008a68] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-[#fef2f2] border border-[#ef4444]/50 text-[#ef4444] p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" /><span>{error}</span>
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-[#e6f7f2] border border-[#00a97f]/50 text-[#00a97f] p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                <CheckCircle className="h-5 w-5 flex-shrink-0" /><span>Profile updated successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="divide-y divide-[#e5e5e5]">
          {/* Physical Measurements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Measurements</div>
              <div className="text-xs text-[#c5c5c5] mt-1">Your current height and weight.</div>
            </div>
            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#2b2b2b] mb-2">Height (cm)</label>
                <input type="number" name="height" value={editFormData.height} onChange={handleChange} required className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#2b2b2b] mb-2">Weight (kg)</label>
                <input type="number" name="weight" value={editFormData.weight} onChange={handleChange} required className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Goals & Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Goals & Details</div>
              <div className="text-xs text-[#c5c5c5] mt-1">Basic info to calculate your metrics.</div>
            </div>
            <div className="lg:col-span-2 max-w-2xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#2b2b2b] mb-2">Goal Weight (kg)</label>
                  <input type="number" name="targetWeight" value={editFormData.targetWeight} onChange={handleChange} required className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#2b2b2b] mb-2">Age</label>
                  <input type="number" name="age" value={editFormData.age} onChange={handleChange} required className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#2b2b2b] mb-2">Sex</label>
                  <select name="sex" value={editFormData.sex} onChange={handleChange} className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all cursor-pointer">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#2b2b2b] mb-2">Primary Goal</label>
                  <select name="goalType" value={editFormData.goalType} onChange={handleChange} className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all cursor-pointer">
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain_weight">Maintain Weight</option>
                    <option value="gain_weight">Gain Weight</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Activity Level</div>
              <div className="text-xs text-[#c5c5c5] mt-1">How active are you on a daily basis?</div>
            </div>
            <div className="lg:col-span-2 max-w-2xl">
              <select name="activityLevel" value={editFormData.activityLevel} onChange={handleChange} className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all cursor-pointer">
                <option value="sedentary">Sedentary (No exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (Physical job/2x training)</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}