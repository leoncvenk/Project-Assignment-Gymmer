import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardSidebar from '../dashboard-layout/DashboardSidebar';
import HomeScreen from '../dashboard-layout/HomeScreen';
import NutritionOverviewTab from '../dashboard/NutritionOverviewTab';
import MealsTab from '../dashboard/MealsTab';
import ActivitiesTab from '../dashboard/ActivitiesTab';
import SecurityTab from '../dashboard/SecurityTab';
import ConnectionsTab from '../dashboard/ConnectionsTab';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
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
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Napaka:", error);
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

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#2b2b2b] flex items-center justify-center text-white font-mono">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white border-t-[#00a97f] rounded-full"
        />
      </div>
    );
  }

  return (
    // Removed the pt-6 pr-6 and changed to standard h-screen flex container
    <div className="flex h-screen w-full bg-[#2b2b2b] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="flex-shrink-0 h-full z-10 border-r border-[#413f4f]">
         <DashboardSidebar 
          userData={userData} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
      </div>

      {/* MAIN CONTENT AREA - Removed border-radius so it sits flush to the edges */}
      <main className="flex-1 h-full bg-[#ffffff] overflow-hidden z-0 relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col"
          >
            {activeTab === 'profile' && <HomeScreen userData={userData} setUserData={setUserData} />}
            {activeTab === 'nutrition' && <NutritionOverviewTab />}
            {activeTab === 'meals' && <MealsTab />}
            {activeTab === 'activities' && <ActivitiesTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'connections' && <ConnectionsTab />}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}