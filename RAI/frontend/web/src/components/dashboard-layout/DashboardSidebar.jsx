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
  LogOut 
} from 'lucide-react';

export default function DashboardSidebar({ userData, activeTab, setActiveTab, onLogout }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close the profile menu automatically if the sidebar collapses
  useEffect(() => {
    if (!isHovered) {
      setIsProfileMenuOpen(false);
    }
  }, [isHovered]);

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
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-full bg-[#2a2a2a] flex flex-col font-mono border-r border-[#3a3a3a] transition-[width] duration-300 ease-in-out flex-shrink-0 z-20 overflow-x-hidden ${
        isHovered ? 'w-[280px]' : 'w-[88px]'
      }`}
    >
      
      {/* Header / Logo */}
      <div className={`flex items-center pt-6 pb-4 transition-all duration-300 ${isHovered ? 'px-6 gap-3' : 'px-0 justify-center'}`}>
        <img 
          src="/images/gymmerLogo.svg" 
          alt="Gymmer Logo" 
          className="w-8 h-8 object-contain flex-shrink-0"
        />
        <span className={`font-semibold text-lg text-[#ffffff] whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          GYMMER
        </span>
      </div>

      {/* Main Navigation */}
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
            <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="pb-4 pt-4 flex flex-col gap-4 overflow-hidden">
        
        {/* Bottom Navigation */}
        <div className="space-y-1.5">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab?.(item.id)}
              className={`w-full flex items-center rounded-md text-[#e5e5e5] hover:bg-[#3f3f4f]/60 transition-colors ${isHovered ? 'px-3 py-2 mx-4 justify-start' : 'w-12 h-12 mx-auto justify-center'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-[#e5e5e5]" strokeWidth={1.5} />
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div className={`pt-3 border-t border-[#3f3f4f]/50 transition-all duration-300 relative ${isHovered ? 'mx-4' : 'mx-2'}`}>
          
          {/* Pop-up Menu */}
          {isProfileMenuOpen && isHovered && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#1e1e1e] border border-[#3f3f4f] rounded-lg shadow-xl overflow-hidden py-1 z-50 flex flex-col transform transition-all">
              <button 
                onClick={() => {
                  setActiveTab?.('profile');
                  setIsProfileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#e5e5e5] hover:bg-[#3f3f4f]/80 transition-colors w-full text-left"
              >
                <User className="w-4 h-4 text-[#a1a1aa]" />
                Profile
              </button>
              <div className="h-[1px] w-full bg-[#3f3f4f]/50 my-0.5"></div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#ff5252] hover:bg-[#ff5252]/10 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}

          {/* Profile Trigger button */}
          <div 
            onClick={() => isHovered && setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center rounded-md cursor-pointer transition-colors group ${
              isProfileMenuOpen ? 'bg-[#3f3f4f]/80' : 'hover:bg-[#3f3f4f]/60'
            } ${isHovered ? 'p-2 justify-between' : 'w-12 h-12 mx-auto justify-center'}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex-shrink-0">
                {userData?.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt={userData.username} 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#3f3f4f] flex items-center justify-center border border-[#555]">
                    <User className="w-4 h-4 text-[#a1a1aa]" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00c896] rounded-full border border-[#2a2a2a]"></div>
              </div>
              <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isHovered ? 'opacity-100 w-[120px]' : 'opacity-0 w-0'}`}>
                <span className="text-sm font-bold text-white truncate whitespace-nowrap">
                  {userData?.username || "Guest User"}
                </span>
                <span className="text-xs text-[#a1a1aa] truncate mt-0.5 whitespace-nowrap">
                  {userData?.email || "guest@example.com"}
                </span>
              </div>
            </div>
            {isHovered && (
              <ChevronsUpDown className={`w-4 h-4 flex-shrink-0 transition-colors ${isProfileMenuOpen ? 'text-white' : 'text-[#a1a1aa] group-hover:text-white'}`} />
            )}
          </div>
        </div>
        
      </div>
    </aside>
  );
}