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
      
    } catch (error) {
      setError("Network error: Make sure your backend (uvicorn) is running.");
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

          {/* Prikaz napak nad obrazcem */}
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
                  <option value="sedentary">Sedentary (No exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (Physical job/2x training)</option>
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
              className={`w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] cursor-pointer'}`}
            >
              {loading ? 'SAVING...' : 'COMPLETE SETUP'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}