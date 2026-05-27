import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Smartphone } from 'lucide-react';

export default function SettingsSecurity() {
  const [securityFormData, setSecurityFormData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleSecurityChange = (e) => {
    setSecurityFormData({ ...securityFormData, [e.target.name]: e.target.value });
    setSecuritySuccess(false);
    setSecurityError(null);
  };

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(false);

    if (securityFormData.newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters long.");
      return;
    }
    if (securityFormData.newPassword !== securityFormData.confirmPassword) {
      setSecurityError("Passwords do not match.");
      return;
    }

    setSecurityLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/change-password", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          current_password: securityFormData.currentPassword,
          new_password: securityFormData.newPassword
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setSecurityError(data.detail || "Failed to update password.");
        setSecurityLoading(false);
        return;
      }

      setSecuritySuccess(true);
      setSecurityFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
      setTimeout(() => setSecuritySuccess(false), 3000);
    } catch {
      setSecurityError("Network error.");
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10">
      <form onSubmit={handleSecuritySubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2b2b2b]">Security</h2>
            <p className="text-sm text-[#c5c5c5] mt-1">Manage your password and authentication settings.</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={securityLoading} 
              className={`px-5 py-2.5 text-sm font-semibold text-white bg-[#00a97f] rounded-xl hover:bg-[#008a68] transition-colors ${securityLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {securityLoading ? 'Updating...' : 'Update Security'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {securityError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-[#fef2f2] border border-[#ef4444]/50 text-[#ef4444] p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" /><span>{securityError}</span>
              </div>
            </motion.div>
          )}
          {securitySuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-[#e6f7f2] border border-[#00a97f]/50 text-[#00a97f] p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                <CheckCircle className="h-5 w-5 flex-shrink-0" /><span>Password updated successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="divide-y divide-[#e5e5e5]">
          {/* Change Password */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Change Password</div>
              <div className="text-xs text-[#c5c5c5] mt-1">Ensure your account stays secure.</div>
            </div>
            <div className="lg:col-span-2 space-y-4 max-w-2xl">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c5c5c5]" />
                <input 
                  type={showPassword.current ? "text" : "password"} 
                  name="currentPassword"
                  value={securityFormData.currentPassword}
                  onChange={handleSecurityChange}
                  placeholder="Old Password" 
                  required
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl pl-11 pr-10 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => toggleVisibility('current')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c5c5c5] hover:text-[#2b2b2b]"
                >
                  {showPassword.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c5c5c5]" />
                <input 
                  type={showPassword.new ? "text" : "password"} 
                  name="newPassword"
                  value={securityFormData.newPassword}
                  onChange={handleSecurityChange}
                  placeholder="New Password" 
                  required
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl pl-11 pr-10 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => toggleVisibility('new')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c5c5c5] hover:text-[#2b2b2b]"
                >
                  {showPassword.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c5c5c5]" />
                <input 
                  type={showPassword.confirm ? "text" : "password"} 
                  name="confirmPassword"
                  value={securityFormData.confirmPassword}
                  onChange={handleSecurityChange}
                  placeholder="Confirm New Password" 
                  required
                  className="w-full bg-white border border-[#e5e5e5] rounded-xl pl-11 pr-10 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] outline-none transition-all" 
                />
                <button 
                  type="button" 
                  onClick={() => toggleVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c5c5c5] hover:text-[#2b2b2b]"
                >
                  {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Reset / Additional Security Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Account Access</div>
              <div className="text-xs text-[#c5c5c5] mt-1">Additional security measures.</div>
            </div>
            <div className="lg:col-span-2 space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-[#e5e5e5]">
                    <Mail className="h-5 w-5 text-[#2b2b2b]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2b2b2b]">Reset password via email</p>
                    <p className="text-xs text-[#c5c5c5] mt-0.5">Receive a secure link to reset it.</p>
                  </div>
                </div>
                <button type="button" className="text-sm font-semibold text-[#2b2b2b] border border-[#e5e5e5] px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">Send Link</button>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#e6f7f2] rounded-xl border border-[#00a97f]/20">
                    <Smartphone className="h-5 w-5 text-[#00a97f]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2b2b2b]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#c5c5c5] mt-0.5">Add an extra layer of security.</p>
                  </div>
                </div>
                <button type="button" className="text-sm font-semibold text-[#00a97f] border border-[#00a97f]/30 bg-[#e6f7f2] px-4 py-2 rounded-xl hover:bg-[#00a97f] hover:text-white transition-colors">Enable 2FA</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}