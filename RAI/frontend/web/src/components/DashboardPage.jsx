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


  // --- LOGIKA ZA UREJANJE PROFILA ---

  const handleEditChange = (e) => {

    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

    setEditSuccess(false); // Skrij success sporočilo, če uporabnik spet tipka

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



      // Uspešno shranjeno! Posodobimo lokalni state, da bo Overview takoj točen

      setUserData(prev => ({ ...prev, profile: payload }));

      setEditSuccess(true);

     

      // Po 3 sekundah skrijemo obvestilo o uspehu

      setTimeout(() => setEditSuccess(false), 3000);



    } catch (error) {

      setEditError("Network error. Is your backend running?");

    } finally {

      setEditLoading(false);

    }

  };




