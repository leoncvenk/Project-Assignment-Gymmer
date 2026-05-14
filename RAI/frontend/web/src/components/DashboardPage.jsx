import { useState, useEffect, useRef, useCallback } from 'react'; // Dodan useCallback
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, Link as LinkIcon, LogOut, 
  Camera, Activity, Ruler, Weight, Target, Shield, Mail,
  AlertCircle, CheckCircle, Heart
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Stanja za urejanje profila
  const [editFormData, setEditFormData] = useState({
    height: '', weight: '', targetWeight: '', age: '',
    sex: 'male', activityLevel: 'sedentary', goalType: 'maintain_weight'
  });
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const logoutTimerRef = useRef(null);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    navigate('/profile');
  }, [navigate]);

  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      alert("Vaša seja je potekla zaradi neaktivnosti.");
      handleLogout();
    }, 30 * 60 * 1000);
  }, [handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/profile');
      return;
    }

    
    window.addEventListener('mousemove', resetLogoutTimer);
    window.addEventListener('keydown', resetLogoutTimer);
    window.addEventListener('click', resetLogoutTimer);
    resetLogoutTimer();

    const fetchUserData = async () => {
      try {
        const userRes = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
       
        const profileRes = await fetch("http://127.0.0.1:8000/users/me/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
       
        if (userRes.ok && profileRes.ok) {
          const userBaseData = await userRes.json();
          const userProfileData = await profileRes.json();
         
          setUserData({ ...userBaseData, profile: userProfileData });
         
          setEditFormData({
            height: userProfileData.height_cm || '',
            weight: userProfileData.weight_kg || '',
            targetWeight: userProfileData.goal_weight_kg || '',
            age: userProfileData.age || '',
            sex: userProfileData.sex || 'male',
            activityLevel: userProfileData.activity_level || 'sedentary',
            goalType: userProfileData.goal_type || 'maintain_weight'
          });
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju podatkov:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      window.removeEventListener('mousemove', resetLogoutTimer);
      window.removeEventListener('keydown', resetLogoutTimer);
      window.removeEventListener('click', resetLogoutTimer);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [navigate, handleLogout, resetLogoutTimer]); 

  // --- LOGIKA ZA UREJANJE PROFILA ---
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    setEditSuccess(false);
  };

  const validateEditInputs = () => {
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(false);

    const validationError = validateEditInputs();
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setEditLoading(true);

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
        setEditError("Failed to update profile. Please try again.");
        setEditLoading(false);
        return;
      }

      setUserData(prev => ({ ...prev, profile: payload }));
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);

    } catch (err) { 
      console.error(err); 
      setEditError("Network error. Is your backend running?");
    } finally {
      setEditLoading(false);
    }
  };

  // --- UI ZAVIHKI ---
  const renderOverview = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h3 className="text-xl text-white font-bold tracking-wide">My Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Height", value: userData?.profile?.height_cm || "?", unit: "cm", icon: Ruler },
          { label: "Weight", value: userData?.profile?.weight_kg || "?", unit: "kg", icon: Weight },
          { label: "Goal", value: userData?.profile?.goal_weight_kg || "?", unit: "kg", icon: Target },
          { label: "Activity", value: userData?.profile?.activity_level?.replace('_', ' ') || "?", unit: "", icon: Activity }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <stat.icon className="h-6 w-6 text-blue-500 mb-2" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <span className="text-xl text-white font-bold mt-1 capitalize">{stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span></span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderEditProfile = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-left">
        <h3 className="text-xl text-white font-bold tracking-wide">Edit Profile</h3>
        <p className="text-gray-400 text-sm mt-1">Update your personal information and goals.</p>
      </div>

      <AnimatePresence>
        {editError && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /><span>{editError}</span>
            </div>
          </motion.div>
        )}
        {editSuccess && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl text-sm flex items-center gap-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0" /><span>Profile updated successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleEditSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Height (cm)</label>
            <div className="relative">
              <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input type="number" name="height" value={editFormData.height} onChange={handleEditChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white focus:border-blue-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Weight (kg)</label>
            <div className="relative">
              <Weight className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input type="number" name="weight" value={editFormData.weight} onChange={handleEditChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Goal Weight (kg)</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input type="number" name="targetWeight" value={editFormData.targetWeight} onChange={handleEditChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white focus:border-blue-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Age</label>
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
              <input type="number" name="age" value={editFormData.age} onChange={handleEditChange} required className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400">Sex</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <select name="sex" value={editFormData.sex} onChange={handleEditChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white appearance-none [color-scheme:dark] focus:border-blue-500 transition-colors">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400">Activity Level</label>
          <div className="relative">
            <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <select name="activityLevel" value={editFormData.activityLevel} onChange={handleEditChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white appearance-none [color-scheme:dark] focus:border-blue-500 transition-colors">
              <option value="sedentary">Sedentary (No exercise)</option>
              <option value="light">Lightly Active (1-3 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very_active">Very Active (Physical job/2x training)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-gray-400">Primary Goal</label>
          <div className="relative">
            <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <select name="goalType" value={editFormData.goalType} onChange={handleEditChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 text-sm text-white appearance-none [color-scheme:dark] focus:border-blue-500 transition-colors">
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="gain_weight">Gain Weight</option>
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={editLoading}
          className={`w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all ${editLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] cursor-pointer'}`}
        >
          {editLoading ? 'SAVING...' : 'SAVE CHANGES'}
        </motion.button>
      </form>
    </motion.div>
  );

  const renderSecurity = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h3 className="text-xl text-white font-bold tracking-wide">Security & Password</h3>
      <form className="space-y-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-xs text-gray-400">Current Password</label>
          <input type="password" placeholder="••••••••" className="w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-gray-400">New Password</label>
          <input type="password" placeholder="••••••••" className="w-full mt-1 bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:border-blue-500 transition-colors" />
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition cursor-pointer">Update Password</button>
      </form>
    </motion.div>
  );

  const renderConnections = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      <h3 className="text-xl text-white font-bold tracking-wide">Connected Accounts</h3>
      <div className="space-y-3 max-w-md">
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <img src="https://svgl.app/library/google.svg" alt="Google" className="w-6 h-6" />
            <span className="text-sm text-white font-medium">Google</span>
          </div>
          <button className="text-xs text-blue-400 hover:text-white transition cursor-pointer">Connect</button>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <img src="https://svgl.app/library/apple_dark.svg" alt="Apple" className="w-6 h-6" />
            <span className="text-sm text-white font-medium">Apple</span>
          </div>
          <button className="text-xs text-gray-500 cursor-not-allowed">Coming Soon</button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">LOADING GYMMER...</div>;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] overflow-x-hidden pt-24 pb-12" style={{ fontFamily: "'Anonymous Pro', monospace" }}>
     
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 z-10">
       
        {/* LEFT SIDEBAR */}
        <motion.div
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
          className="w-full md:w-72 flex-shrink-0"
        >
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
           
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1">
                <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
           
            <h2 className="mt-4 text-xl text-white font-bold tracking-wide">@{userData?.username || "gymmer"}</h2>
            <p className="text-xs text-gray-400 flex items-center mt-1"><Mail className="h-3 w-3 mr-1" />{userData?.email}</p>

            <div className="w-full h-px bg-white/10 my-6"></div>

            <nav className="w-full flex flex-col gap-2">
              <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <Activity className="h-4 w-4" /> Overview
              </button>
              <button onClick={() => setActiveTab('edit')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'edit' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <Settings className="h-4 w-4" /> Edit Profile
              </button>
              <button onClick={() => setActiveTab('security')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'security' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <Shield className="h-4 w-4" /> Security
              </button>
              <button onClick={() => setActiveTab('connections')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'connections' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <LinkIcon className="h-4 w-4" /> Connections
              </button>
            </nav>

            <div className="w-full h-px bg-white/10 my-6"></div>

            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all cursor-pointer">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* RIGHT CONTENT AREA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <div key={activeTab}>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'edit' && renderEditProfile()}
              {activeTab === 'security' && renderSecurity()}
              {activeTab === 'connections' && renderConnections()}
            </div>
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}