import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Mail, AlertCircle, CheckCircle, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const buildImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

export default function SettingsDetails({ userData, setUserData }) {
  const [detailsFormData, setDetailsFormData] = useState({
    username: userData?.username || ''
  });
  const [detailsError, setDetailsError] = useState(null);
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userData?.username) {
      setDetailsFormData(prev => ({ ...prev, username: userData.username }));
    }
  }, [userData]);

  const handleDetailsChange = (e) => {
    setDetailsFormData({ ...detailsFormData, [e.target.name]: e.target.value });
    setDetailsError(null);
    setDetailsSuccess(false);
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setDetailsError(null);
    setDetailsSuccess(false);
    
    if (!detailsFormData.username.trim()) {
      setDetailsError("Username cannot be empty.");
      return;
    }

    setDetailsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ username: detailsFormData.username }),
      });

      if (!response.ok) {
        const data = await response.json();
        setDetailsError(data.detail || "Failed to update username.");
        setDetailsLoading(false);
        return;
      }

      setUserData(prev => ({ ...prev, username: detailsFormData.username }));
      setDetailsSuccess(true);
      setTimeout(() => setDetailsSuccess(false), 3000);
    } catch {
      setDetailsError("Network error. Is your backend running?");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleProfileImageUpload = async (file) => {
    if (!file) return;

    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      setDetailsError('Only SVG, PNG, JPG and GIF images are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setDetailsError('Profile image must be smaller than 2 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setImageUploading(true);
    setDetailsError(null);
    setDetailsSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me/profile-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setDetailsError(data.detail || 'Failed to upload profile image.');
        return;
      }

      setUserData(prev => ({
        ...prev,
        ...data,
        profileImage: buildImageUrl(data.profile_image_url),
      }));

      setDetailsSuccess(true);
      setTimeout(() => setDetailsSuccess(false), 3000);
    } catch {
      setDetailsError('Network error. Is your backend running?');
    } finally {
      setImageUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleProfileImageUpload(e.dataTransfer.files?.[0]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10">
      <form onSubmit={handleDetailsSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#2b2b2b]">Personal info</h2>
            <p className="text-sm text-[#c5c5c5] mt-1">Update your photo and personal details here.</p>
          </div>
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={detailsLoading}
              className={`px-5 py-2.5 text-sm font-semibold text-white bg-[#00a97f] rounded-xl hover:bg-[#008a68] transition-colors ${detailsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {detailsLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {detailsError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-[#fef2f2] border border-[#ef4444]/50 text-[#ef4444] p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" /><span>{detailsError}</span>
              </div>
            </motion.div>
          )}
          {detailsSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6">
              <div className="bg-[#e6f7f2] border border-[#00a97f]/50 text-[#00a97f] p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
                <CheckCircle className="h-5 w-5 flex-shrink-0" /><span>Details updated successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="divide-y divide-[#e5e5e5]">
          {/* Username */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Username</div>
            </div>
            <div className="lg:col-span-2">
              <input 
                type="text"
                name="username"
                value={detailsFormData.username}
                onChange={handleDetailsChange}
                className="w-full max-w-2xl bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm text-[#2b2b2b] focus:border-[#00a97f] focus:ring-1 focus:ring-[#00a97f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Email address</div>
            </div>
            <div className="lg:col-span-2 relative max-w-2xl">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c5c5c5]" />
              <input 
                type="email" 
                defaultValue={userData?.email || ''}
                readOnly
                className="w-full bg-gray-50 border border-[#e5e5e5] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[#8c8c8c] outline-none cursor-not-allowed transition-all"
              />
            </div>
          </div>

          {/* Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Your photo</div>
              <div className="text-xs text-[#c5c5c5] mt-1">This will be displayed on your profile.</div>
            </div>
            <div className="lg:col-span-2 flex flex-col sm:flex-row items-start gap-6 max-w-2xl">
              
              {/* Image / Fallback Container */}
              {userData?.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover border border-[#e5e5e5] flex-shrink-0" 
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-[#e5e5e5] flex-shrink-0">
                  <User className="w-8 h-8 text-[#c5c5c5]" />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                className="hidden"
                onChange={(e) => handleProfileImageUpload(e.target.files?.[0])}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`flex-1 w-full border-2 border-dashed border-[#e5e5e5] rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group ${imageUploading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <div className="w-10 h-10 bg-white border border-[#e5e5e5] rounded-full flex items-center justify-center mb-3 group-hover:shadow-sm transition-all">
                  <UploadCloud className="w-5 h-5 text-[#2b2b2b]" />
                </div>
                <p className="text-sm text-[#2b2b2b]"><span className="text-[#00a97f] font-semibold">{imageUploading ? 'Uploading...' : 'Click to upload'}</span> or drag and drop</p>
                <p className="text-xs text-[#c5c5c5] mt-1">SVG, PNG, JPG or GIF (max. 2 MB)</p>
              </div>
            </div>
          </div>

          {/* Linked Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <div>
              <div className="text-sm font-semibold text-[#2b2b2b]">Linked accounts</div>
              <div className="text-xs text-[#c5c5c5] mt-1">Manage your connected social providers.</div>
            </div>
            <div className="lg:col-span-2 space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-[#2b2b2b]">Google</p>
                    <p className="text-xs text-[#c5c5c5]">Connected</p>
                  </div>
                </div>
                <button type="button" className="text-sm font-semibold text-[#ef4444] hover:text-[#dc2626] transition-colors">Disconnect</button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-xl bg-white">
                <div className="flex items-center gap-4">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M15.485 10.495c-.062-2.923 2.39-4.364 2.502-4.436-1.353-1.984-3.447-2.253-4.186-2.285-1.785-.181-3.486 1.054-4.402 1.054-.914 0-2.31-1.018-3.79-1.002-1.914.019-3.682 1.116-4.664 2.827-1.996 3.468-.511 8.601 1.436 11.423.953 1.381 2.073 2.927 3.568 2.871 1.442-.058 1.998-.934 3.738-.934 1.737 0 2.239.934 3.766.904 1.554-.029 2.518-1.401 3.464-2.784 1.096-1.603 1.547-3.155 1.572-3.238-.035-.015-3.036-1.168-3.004-4.401zM11.968 5.485c.789-.958 1.319-2.291 1.173-3.621-1.144.047-2.522.766-3.333 1.745-.649.778-1.291 2.138-1.121 3.445 1.28.1 2.493-.611 3.281-1.569z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-[#2b2b2b]">Apple</p>
                    <p className="text-xs text-[#c5c5c5]">Not connected</p>
                  </div>
                </div>
                <button type="button" className="text-sm font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors">Connect</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}