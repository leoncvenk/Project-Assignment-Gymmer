import React, { useState } from 'react';
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