import { motion } from 'framer-motion';
import { User, Camera, Mail, Shield, Link as LinkIcon, LogOut, Dumbbell, PieChart, Utensils } from 'lucide-react';

export default function DashboardSidebar({ userData, activeTab, setActiveTab, onLogout }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}
      className="w-72 h-full flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl flex-shrink-0 z-20 overflow-hidden"
    >
      {/* HEADER DEL (Slika, Username in Email) */}
      <div className="p-6 border-b border-[var(--border)] flex flex-col items-center bg-[var(--surface-dark)]/50">
        <div className="relative group cursor-pointer">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)] p-0.5">
            <div className="w-full h-full bg-[var(--surface-dark)] rounded-full flex items-center justify-center overflow-hidden border border-[var(--border)]">
              <User className="h-9 w-9 text-[var(--muted)]" />
            </div>
          </div>
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-[var(--text-primary)]" />
          </div>
        </div>
        
        <h2 className="mt-4 text-lg text-[var(--text-primary)] font-bold tracking-wide">@{userData?.username || "gymmer"}</h2>
        <p className="text-xs text-[var(--muted)] flex items-center mt-1"><Mail className="h-3 w-3 mr-1" />{userData?.email}</p>
      </div>

      {/* NAVIGACIJA */}
      <nav className="w-full flex-1 p-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {[
          { id: 'profile', icon: User, label: 'Profile & Overview' },
          { id: 'nutrition', icon: PieChart, label: 'Nutrition Trends' },
          { id: 'meals', icon: Utensils, label: 'Meals Tracker' },
          { id: 'activities', icon: Dumbbell, label: 'Activities' },
          { id: 'security', icon: Shield, label: 'Security' },
          { id: 'connections', icon: LinkIcon, label: 'Connections' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-sm ${activeTab === tab.id ? 'bg-[var(--accent)] text-[var(--text-inverse)] font-bold shadow-md' : 'text-[var(--muted)] hover:bg-[var(--surface-dark)] hover:text-[var(--text-primary)]'}`}
          >
            <tab.icon className="h-4 w-4 flex-shrink-0" /> <span className="flex-1">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* FOOTER Z ODJAVO */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-dark)]/50">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all cursor-pointer text-sm font-medium">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </motion.div>
  );
}