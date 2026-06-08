import { useState } from 'react';
import { motion } from 'framer-motion';

import SettingsDetails from './SettingsDetails';
import SettingsProfile from './SettingsProfile';
import SettingsSecurity from './SettingsSecurity';
import SettingsPlan from './SettingsPlan';

export default function Settings({ userData, setUserData }) {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'My details' },
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'plan', label: 'Plan' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-8 md:p-10 lg:p-12">
      {/* Header & Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2b2b2b] mb-6">Settings</h1>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-[#e5e5e5]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-[#2b2b2b]' 
                  : 'text-[#c5c5c5] hover:text-[#2b2b2b]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a97f]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
        {activeTab === 'details' && <SettingsDetails userData={userData} setUserData={setUserData} />}
        {activeTab === 'profile' && <SettingsProfile userData={userData} setUserData={setUserData} />}
        {activeTab === 'security' && <SettingsSecurity />}
        {activeTab === 'plan' && <SettingsPlan />}
      </div>
    </div>
  );
}