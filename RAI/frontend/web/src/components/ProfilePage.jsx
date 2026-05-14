import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ruler, Weight, Target, Activity, User, Heart, Settings } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TOČNO TAKO, KOT ZAHTEVA user_profile_schema.py
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
      // Uporabimo PUT in naslov iz user_profile.py
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
        alert(
          `API ERROR ${response.status}: ` +
          (typeof responseData.detail === "string" 
            ? responseData.detail 
            : JSON.stringify(responseData.detail, null, 2))
        );
        setLoading(false);
        return;
      }

      alert("Profile setup completed successfully!");
      navigate('/food'); 
      
    } catch (error) {
      alert(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden pt-24 pb-12">
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full max-w-lg px-6 z-10"
        style={{ fontFamily: "'Anonymous Pro', monospace" }}
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full">
          
          <div className="text-left mb-6">
            <h2 className="text-2xl text-white font-bold tracking-wide mb-1">Complete Profile</h2>
            <p className="text-gray-400 text-xs leading-relaxed">Fill in all details to sync with Gymmer's backend.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="number" name="height" value={formData.height} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white" placeholder="180" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white" placeholder="75" />
                </div>
              </div>
            </div>

            {/* Target Weight & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300">Goal Weight (kg)</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white" placeholder="70" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300">Age</label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white" placeholder="25" />
                </div>
              </div>
            </div>

            {/* Sex Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300">Sex</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white appearance-none [color-scheme:dark]">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300">Activity Level</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white appearance-none [color-scheme:dark]">
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly Active</option>
                  <option value="moderate">Moderately Active</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>

            {/* Goal Type */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300">Primary Goal</label>
              <div className="relative">
                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select name="goalType" value={formData.goalType} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white appearance-none [color-scheme:dark]">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer"
            >
              {loading ? 'SAVING...' : 'COMPLETE SETUP'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}