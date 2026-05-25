import React from 'react';
import { 
  Calendar, 
  UserPlus, 
  Edit3, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function HomeScreen() {
  // Hardcoded to empty array to show the empty state
  const friends = []; 

  return (
    <div className="flex flex-col w-full h-full bg-[#ffffff] font-sans text-[#2b2b2b] p-6 overflow-hidden">
      
      {/* Header Section */}
      <header className="flex-shrink-0 flex items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-semibold mb-3">Dashboard</h1>
          <div className="inline-flex rounded-md border border-gray-200 bg-white shadow-sm p-0.5">
            {['24 hours', '7 days', '30 days', '12 months'].map((tab, idx) => (
              <button 
                key={idx}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  idx === 0 
                    ? 'bg-gray-100 text-[#2b2b2b] shadow-sm' 
                    : 'text-gray-500 hover:text-[#2b2b2b]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            May 25, 2026 – June 5, 2026
          </button>
        </div>
      </header>

      {/* Activity Chart Section */}
      <div className="flex-shrink-0 border border-gray-200 rounded-xl p-5 mb-5 flex relative">
        {/* Left: Steps & Chart */}
        <div className="flex-1 pr-6 flex flex-col">
          <div className="mb-2">
            <p className="text-xs font-medium text-gray-500 mb-1">Total Steps</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-semibold">8,432</h2>
              <span className="flex items-center text-[10px] font-medium text-[#00a97f] bg-[#e6f7f2] px-1.5 py-0.5 rounded-full">
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> 12.4%
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[60px] relative mt-2">
            <svg viewBox="0 0 800 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <path 
                d="M0,80 L100,60 L200,70 L300,40 L400,60 L500,30 L600,50 L700,20 L800,45" 
                fill="none" 
                stroke="#00a97f" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute bottom-[-15px] left-0 w-full flex justify-between text-[9px] text-gray-400 font-medium">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right: Sub-stats */}
        <div className="w-[200px] flex flex-col justify-between pl-6 border-l border-gray-100">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5 flex items-center gap-1">
              <Flame className="w-3 h-3" /> Calories Burned
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">2,450 <span className="text-xs font-normal text-gray-500">kcal</span></h3>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Active Time
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">85 <span className="text-xs font-normal text-gray-500">min</span></h3>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Avg. Heart Rate
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">112 <span className="text-xs font-normal text-gray-500">bpm</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* Start Creating Content Section */}
      <div className="flex-shrink-0 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left group">
            <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white group-hover:bg-gray-50">
              <UserPlus className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2b2b2b]">Log a Workout</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Manually enter your recent activity</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left group">
            <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white group-hover:bg-gray-50">
              <Edit3 className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2b2b2b]">Add a Meal</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Track your calories and macros</p>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Split Section */}
      <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
        
        {/* Trending Recipes */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-xs font-semibold">Trending Recipes</h3>
            <button className="flex items-center gap-1 text-[10px] font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors group">
              All recipes
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
            {/* Recipe 1 */}
            <div className="flex flex-col h-full min-h-0 group cursor-pointer">
              <div className="flex-1 min-h-0 relative w-full rounded-xl overflow-hidden mb-2 bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" 
                  alt="High-Protein Avocado Toast" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0">
                <p className="text-[10px] font-semibold text-[#00a97f] mb-1">Breakfast • 15 min</p>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold group-hover:text-[#00a97f] transition-colors truncate pr-2">High-Protein Avocado Toast</h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">A quick, easy, and nutrient-dense breakfast packed with healthy fats to start your day right.</p>
              </div>
            </div>

            {/* Recipe 2 */}
            <div className="flex flex-col h-full min-h-0 group cursor-pointer">
              <div className="flex-1 min-h-0 relative w-full rounded-xl overflow-hidden mb-2 bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800" 
                  alt="Grilled Chicken Salad" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0">
                <p className="text-[10px] font-semibold text-[#00a97f] mb-1">Lunch • 25 min</p>
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold group-hover:text-[#00a97f] transition-colors truncate pr-2">Grilled Chicken Salad</h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">Refreshing and packed with lean protein. The perfect post-workout meal for recovery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Friends List / Empty State */}
        <div className="w-[240px] flex flex-col flex-shrink-0 overflow-hidden">
          <h3 className="text-xs font-semibold mb-3 flex-shrink-0">Friends</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            
            {friends.length > 0 ? (
              <div className="space-y-3">
                {friends.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-[#2b2b2b] group-hover:text-[#00a97f] transition-colors">{member.name}</h4>
                        <p className="text-[10px] text-gray-500">Friends since {member.date}</p>
                      </div>
                    </div>
                    {member.active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00a97f]"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 pb-6">
                <span className="text-4xl" role="img" aria-label="sad">😔</span>
                <p className="text-xs text-gray-500 px-4">You don't have any friends added yet.</p>
                <button className="text-xs font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors">
                  Add Friends
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}