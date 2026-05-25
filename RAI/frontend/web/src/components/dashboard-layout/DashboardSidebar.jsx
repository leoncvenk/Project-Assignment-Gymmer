import React, { useState } from 'react';
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
  User 
} from 'lucide-react';

export default function DashboardSidebar({ userData }) {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Apple, label: 'Food Analytics' },
    { icon: ChefHat, label: 'Recipes' },
    { icon: Dumbbell, label: 'Activities' },
  ];

  const bottomNavItems = [
    { icon: LifeBuoy, label: 'Support' },
    { icon: Settings, label: 'Settings' },
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
      <nav className="flex-1 space-y-1.5 overflow-hidden">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center rounded-md transition-colors ${
              item.active 
                ? 'bg-[#3f3f4f] text-white shadow-sm' 
                : 'text-[#e5e5e5] hover:bg-[#3f3f4f]/60'
            } ${isHovered ? 'px-3 py-2.5 mx-4 justify-start' : 'w-12 h-12 mx-auto justify-center'}`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-white' : 'text-[#e5e5e5]'}`} strokeWidth={1.5} />
            <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              {item.label}
            </span>
          </a>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="pb-4 pt-4 flex flex-col gap-4 overflow-hidden">
        
        {/* Bottom Navigation */}
        <div className="space-y-1.5">
          {bottomNavItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center rounded-md text-[#e5e5e5] hover:bg-[#3f3f4f]/60 transition-colors ${isHovered ? 'px-3 py-2 mx-4 justify-start' : 'w-12 h-12 mx-auto justify-center'}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-[#e5e5e5]" strokeWidth={1.5} />
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isHovered ? 'ml-3 opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </a>
          ))}
        </div>

        {/* User Profile */}
        <div className={`pt-3 border-t border-[#3f3f4f]/50 transition-all duration-300 ${isHovered ? 'mx-4' : 'mx-2'}`}>
          <div className={`flex items-center hover:bg-[#3f3f4f]/60 rounded-md cursor-pointer transition-colors group ${isHovered ? 'p-2 justify-between' : 'w-12 h-12 mx-auto justify-center'}`}>
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
            {isHovered && <ChevronsUpDown className="w-4 h-4 text-[#a1a1aa] group-hover:text-white flex-shrink-0" />}
          </div>
        </div>
        
      </div>
    </aside>
  );
}