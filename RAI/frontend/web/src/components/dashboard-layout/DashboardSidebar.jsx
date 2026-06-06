import React, { useState, useEffect } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Apple, 
  ChefHat, 
  Dumbbell, 
  LifeBuoy, 
  Settings, 
  X, 
  Play, 
  ChevronsUpDown,
  User,
  LogOut,
  Radio 
} from 'lucide-react';

export default function DashboardSidebar({ userData, activeTab, setActiveTab, onLogout }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // States for live device tracking
  const [activeDevices, setActiveDevices] = useState(0);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);

  const profileBanner =
    userData?.profile_theme?.banner_gradient ||
    userData?.profileTheme?.banner_gradient ||
    'linear-gradient(135deg, #3f3f4f, #2a2a2a)';

  // Close the profile menu automatically if the sidebar collapses
  useEffect(() => {
    if (!isHovered) {
      setIsProfileMenuOpen(false);
    }
  }, [isHovered]);

  // Fetch active devices count from API
  useEffect(() => {
    let isMounted = true;

    const fetchActiveCount = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const apiUrl = 'http://127.0.0.1:8000'; 
        
        const res = await fetch(`${apiUrl}/api/users/me/devices/active-count`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true', 
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) setActiveDevices(data.active_devices || 0);
        }
      } catch (error) {
        console.log('Error fetching active devices:', error);
      }
    };

    fetchActiveCount();
    const interval = setInterval(fetchActiveCount, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { id: 'profile', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'nutrition', icon: Apple, label: 'Food Analytics' },
    { id: 'meals', icon: ChefHat, label: 'Recipes' },
    { id: 'activities', icon: Dumbbell, label: 'Activities' },
  ];

  const bottomNavItems = [
    { id: 'support', icon: LifeBuoy, label: 'Support' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-full bg-[#2a2a2a] flex flex-col font-mono border-r border-[#3a3a3a] transition-[width] duration-300 ease-in-out flex-shrink-0 z-20 overflow-x-hidden ${
          isHovered ? 'w-[280px]' : 'w-[88px]'
        }`}
      >
        <div className={`flex items-center pt-6 pb-4 transition-all duration-300 ${isHovered ? 'px-6 gap-3' : 'px-0 justify-center'}`}>
          <img src="/images/gymmerLogo.svg" alt="Gymmer Logo" className="w-8 h-8 object-contain flex-shrink-0" />
          <span className={`font-semibold text-lg text-[#ffffff] whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>GYMMER</span>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-hidden mt-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab?.(item.id)}
              className={`w-full flex items-center rounded-md transition-colors ${
                activeTab === item.id || (item.id === 'profile' && !activeTab)
                  ? 'bg-[#3f3f4f] text-white shadow-sm' 
                  : 'text-[#e5e5e5] hover:bg-[#3f3f4f]/60'
              } ${isHovered ? 'px-3 py-2.5 mx-4 justify-start' : 'w-12 h-12 mx-auto justify-center'}`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-white' : 'text-[#e5e5e5]'}`} strokeWidth={1.5} />
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 w-auto' : 'opacity-0 w-0'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pb-4 pt-4 flex flex-col gap-4 overflow-hidden">
          <div className="space-y-1.5">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab?.(item.id)}
                className={`w-full flex items-center rounded-md text-[#e5e5e5] hover:bg-[#3f3f4f]/60 transition-colors ${isHovered ? 'px-3 py-2 mx-4 justify-start' : 'w-12 h-12 mx-auto justify-center'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0 text-[#e5e5e5]" strokeWidth={1.5} />
                <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 w-auto' : 'opacity-0 w-0'}`}>{item.label}</span>
              </button>
            ))}
          </div>

          <div className={`pt-3 border-t border-[#3f3f4f]/50 transition-all duration-300 relative ${isHovered ? 'mx-4' : 'mx-2'}`}>
            {isProfileMenuOpen && isHovered && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#1e1e1e] border border-[#3f3f4f] rounded-lg shadow-xl overflow-hidden py-1 z-50 flex flex-col transform transition-all">
                <button onClick={() => setIsDevicesModalOpen(true)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#3f3f4f]/50 transition-colors w-full text-left border-b border-[#3f3f4f]/50">
                  <Radio size={16} className={activeDevices > 0 ? "text-[#00c896]" : "text-gray-500"} />
                  <span>Live Devices</span>
                  {activeDevices > 0 && (
                    <span className="ml-auto relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c896] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c896]"></span>
                    </span>
                  )}
                </button>
                <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#ff5252] hover:bg-[#ff5252]/10 transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            )}
            
            {/* Profile Trigger */}
            <div 
              onClick={() => isHovered && setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`relative overflow-hidden flex items-center rounded-xl cursor-pointer transition-all group ${
                isHovered ? 'p-2 justify-between shadow-sm' : 'w-12 h-12 mx-auto justify-center'
              }`}
              style={{ background: isHovered ? profileBanner : 'transparent' }}
            >
              {isHovered && <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />}
              <div className="relative z-10 flex items-center gap-3 overflow-hidden">
                <div className="relative flex-shrink-0">
                  {userData?.profileImage ? (
                    <img src={userData.profileImage} alt={userData.username} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#3f3f4f] flex items-center justify-center border border-[#555]"><User className="w-4 h-4 text-[#a1a1aa]" /></div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#2a2a2a] ${activeDevices > 0 ? 'bg-[#00c896]' : 'bg-gray-500'}`}></div>
                </div>
                <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isHovered ? 'opacity-100 w-[120px]' : 'opacity-0 w-0'}`}>
                  <span className="text-sm font-bold text-white truncate whitespace-nowrap">{userData?.username || "Guest"}</span>
                  <span className="text-xs text-white/75 truncate mt-0.5 whitespace-nowrap">{userData?.email || "guest@gymmer.com"}</span>
                </div>
              </div>
              {isHovered && <ChevronsUpDown className="relative z-10 w-4 h-4 text-white/80 group-hover:text-white" />}
            </div>
          </div>
        </div>
      </aside>

      {isDevicesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-80 rounded-3xl bg-[#1e1e1e] p-8 shadow-2xl border border-[#3f3f4f] text-center animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsDevicesModalOpen(false)} className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors cursor-pointer"><X size={20} /></button>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2a2a2a] border border-[#3f3f4f]"><Radio size={28} className={activeDevices > 0 ? "text-[#00c896]" : "text-gray-500"} /></div>
            <h3 className="mb-2 text-xl font-bold text-white font-sans">Live Devices</h3>
            <p className="mb-6 text-xs text-gray-400 font-sans">System is monitoring your active devices in real-time via MQTT heartbeat.</p>
            <div className="rounded-2xl border border-[#3f3f4f] bg-[#2a2a2a] p-5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 font-sans">Currently Active</span>
              <div className={`mt-1 text-5xl font-black font-sans ${activeDevices > 0 ? 'text-[#00c896]' : 'text-gray-500'}`}>{activeDevices}</div>
            </div>
            <button onClick={() => setIsDevicesModalOpen(false)} className="mt-6 w-full rounded-xl bg-[#00a97f] py-3 text-sm font-semibold text-white hover:bg-[#008a68] transition-colors cursor-pointer font-sans shadow-sm">Got it</button>
          </div>
        </div>
      )}
    </>
  );
}