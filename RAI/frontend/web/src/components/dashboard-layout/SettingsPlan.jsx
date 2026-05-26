import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function SettingsPlan() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-20 h-20 bg-[#fff7ed] rounded-full flex items-center justify-center mb-6">
        <Shield className="w-10 h-10 text-[#f59e0b]" />
      </div>
      <h2 className="text-3xl font-bold text-[#2b2b2b] mb-3">Coming Soon 🚀</h2>
      <p className="text-sm text-[#c5c5c5] max-w-md leading-relaxed">
        We are working hard on bringing you custom tailored subscription plans to supercharge your fitness journey. Stay tuned!
      </p>
    </motion.div>
  );
}