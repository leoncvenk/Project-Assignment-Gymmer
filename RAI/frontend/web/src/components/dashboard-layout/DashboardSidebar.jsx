import React from 'react';
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

export default function DashboardSidebar() {
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
    <aside className="w-[280px] h-[calc(100vh-1.5rem)] ml-2 mb-6 bg-[#2a2a2a] flex flex-col font-mono rounded-lg shadow-xl border-r border-[#3a3a3a]">
      
    {/* Header / Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <img 
          src="/images/gymmerLogo.svg" 
          alt="Gymmer Logo" 
          className="w-8 h-8 object-contain"
        />
        <span className="font-semibold text-lg text-[#ffffff]">GYMMER</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-colors ${
              item.active 
                ? 'bg-[#3f3f4f] text-white shadow-sm' 
                : 'text-[#e5e5e5] hover:bg-[#3f3f4f]/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-[#e5e5e5]'}`} strokeWidth={1.5} />
              <span className="text-sm">{item.label}</span>
            </div>
          </a>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-4 pt-4 flex flex-col gap-4">
        
        {/* Bottom Navigation */}
        <div className="space-y-1.5">
          {bottomNavItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[#e5e5e5] hover:bg-[#3f3f4f]/60 transition-colors"
            >
              <item.icon className="w-5 h-5 text-[#e5e5e5]" strokeWidth={1.5} />
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Feature Promo Card */}
        <div className="bg-[#3b3b4f] rounded-lg p-4 relative shadow-md">
          <button className="absolute top-3 right-3 text-[#a1a1aa] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
          
          <h4 className="text-sm font-bold text-white mb-1.5">New features available!</h4>
          <p className="text-xs text-[#a1a1aa] mb-3 leading-relaxed">
            Check out the new dashboard view. Pages now load faster.
          </p>
          
          <div className="relative rounded-md overflow-hidden mb-3 cursor-pointer group">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" 
              alt="Feature preview" 
              className="w-full h-20 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs mt-1">
            <button className="text-[#a1a1aa] hover:text-white font-semibold transition-colors">
              Dismiss
            </button>
            <button className="text-[#00c896] hover:text-[#00e0a8] font-semibold transition-colors">
              What's new?
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-3 border-t border-[#3f3f4f]/50">
          <div className="flex items-center justify-between p-2 hover:bg-[#3f3f4f]/60 rounded-md cursor-pointer transition-colors group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#3f3f4f] flex items-center justify-center border border-[#555]">
                  <User className="w-4 h-4 text-[#a1a1aa]" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00c896] rounded-full border border-[#2a2a2a]"></div>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">Ultyyy</span>
                <span className="text-xs text-[#a1a1aa] truncate mt-0.5">ultimateultrap@gmail...</span>
              </div>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-[#a1a1aa] group-hover:text-white flex-shrink-0" />
          </div>
        </div>
        
      </div>
    </aside>
  );
}