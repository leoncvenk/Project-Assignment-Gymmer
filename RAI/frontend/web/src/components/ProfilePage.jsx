import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ruler, Weight, Target, Activity } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    targetWeight: '',
    activityLevel: 'sedentary',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API klic za kasneje 
      /*
      const response = await fetch('http://127.0.0.1:8000/auth/profile', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Napaka pri shranjevanju profila');
      */

      console.log('Profile setup complete:', formData);
      navigate('/food'); 
      
    } catch (error) {
      console.error('Error setting up profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Uporabljeno natanko enako ozadje kot na RegisterPage
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden pt-24 pb-6">
      
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
            <p className="text-gray-400 text-xs leading-relaxed">
              Tell us a bit more about yourself to personalize your Gymmer experience and set your daily goals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Height */}
              <div className="space-y-1.5">
                <label htmlFor="height" className="text-xs text-gray-300">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="180"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label htmlFor="weight" className="text-xs text-gray-300">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="75"
                  />
                </div>
              </div>
            </div>

            {/* Target Weight */}
            <div className="space-y-1.5">
              <label htmlFor="targetWeight" className="text-xs text-gray-300">Target Weight (kg)</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="number"
                  id="targetWeight"
                  name="targetWeight"
                  value={formData.targetWeight}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="70"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-1.5">
              <label htmlFor="activityLevel" className="text-xs text-gray-300">Activity Level</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors appearance-none [color-scheme:dark]"
                >
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Lightly active (1-3 days/week)</option>
                  <option value="moderate">Moderately active (3-5 days/week)</option>
                  <option value="active">Very active (6-7 days/week)</option>
                  <option value="extra">Extra active (Physical job)</option>
                </select>
              </div>
            </div>

            {/* Submit gumb iz Register stran */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold tracking-wide mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all cursor-pointer flex justify-center items-center"
            >
              {loading ? 'SAVING...' : 'COMPLETE SETUP'}
            </motion.button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}