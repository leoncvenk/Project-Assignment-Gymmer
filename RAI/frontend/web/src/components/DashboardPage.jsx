import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

import {

  User, Settings, Key, Link as LinkIcon, LogOut,

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



  const handleLogout = () => {

    localStorage.removeItem('access_token');

    navigate('/profile');

  };



  const resetLogoutTimer = () => {

    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    logoutTimerRef.current = setTimeout(() => {

      alert("Vaša seja je potekla zaradi neaktivnosti.");

      handleLogout();

    }, 30 * 60 * 1000);

  };

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

         

          // Predizpolnimo formo za urejanje z obstoječimi podatki

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

  }, [navigate]);


