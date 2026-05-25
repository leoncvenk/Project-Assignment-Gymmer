import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Novi modularni uvozi
import DashboardSidebar from '../dashboard-layout/DashboardSidebar';
import ProfileOverviewTab from '../dashboard/ProfileOverviewTab';
import NutritionOverviewTab from '../dashboard/NutritionOverviewTab';
import MealsTab from '../dashboard/MealsTab';
import ActivitiesTab from '../dashboard/ActivitiesTab';
import SecurityTab from '../dashboard/SecurityTab';
import ConnectionsTab from '../dashboard/ConnectionsTab';

export default function DashboardPage() {
  const navigate = useNavigate();
  // ZELO POMEMBNO: Privzeti zavihek je zdaj 'profile'
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
    return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--text-primary)] font-mono">LOADING GYMMER...</div>;
  }

  return (
    <div className="relative w-full h-screen flex gap-6 p-4 sm:p-6 lg:p-8 bg-[var(--background)] overflow-hidden font-mono">
      
      {/* LEVI MENI */}
      <DashboardSidebar 
        userData={userData} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* GLAVNA VSEBINA */}
      <motion.main
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}
        className="flex-1 h-full bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 md:p-10 overflow-y-auto shadow-2xl custom-scrollbar"
      >
        <div className="w-full"> 
          <AnimatePresence mode="wait">
            <div key={activeTab}>
              {activeTab === 'profile' && <ProfileOverviewTab userData={userData} setUserData={setUserData} />}
              {activeTab === 'nutrition' && <NutritionOverviewTab />}
              {activeTab === 'meals' && <MealsTab />}
              {activeTab === 'activities' && <ActivitiesTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'connections' && <ConnectionsTab />}
            </div>
          </AnimatePresence>
        </div>
      </motion.main>

    </div>
  );
}