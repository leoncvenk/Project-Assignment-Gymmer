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
