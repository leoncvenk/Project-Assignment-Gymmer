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

export default function HomeScreen({ setActiveTab }) {
  // Hardcoded to empty array to show the empty state
  const friends = []; 
  const dashboardStats = {
    steps: 0,
    caloriesBurned: 0,
    activeMinutes: 0,
    averageHeartRate: 0,
  };

  const trendingRecipes = [];

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
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
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
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            No date range selected
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
              <h2 className="text-2xl font-semibold">
                {dashboardStats.steps.toLocaleString()}
              </h2>
            </div>
          </div>
          
          <div className="flex-1 min-h-[90px] relative mt-2">
            <div className="flex h-full min-h-[90px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400">
              No activity data available yet.
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
              <h3 className="text-lg font-semibold">
                {dashboardStats.caloriesBurned}
                <span className="text-xs font-normal text-gray-500"> kcal</span>
              </h3>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Active Time
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">
                {dashboardStats.activeMinutes}
                <span className="text-xs font-normal text-gray-500"> min</span>
              </h3>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Avg. Heart Rate
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold">
                {dashboardStats.averageHeartRate}
                <span className="text-xs font-normal text-gray-500"> bpm</span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveTab?.('activities')}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white group-hover:bg-gray-50">
              <UserPlus className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2b2b2b]">Log a Workout</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Manually enter your recent activity</p>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab?.('nutrition')}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left group cursor-pointer"
          >
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
        
        {/* Trending Recipes Empty State */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="text-xs font-semibold">Trending Recipes</h3>
            <button 
              onClick={() => setActiveTab?.('meals')}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors group cursor-pointer"
            >
              All recipes
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          
          <div className="flex-1 min-h-0 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-6">
            <p className="text-sm font-semibold text-[#2b2b2b]">
              No trending recipes yet.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Recipes will appear here once real recipe data is available.
            </p>
            <button
              onClick={() => setActiveTab?.('meals')}
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors cursor-pointer"
            >
              Browse recipes
              <ArrowRight className="w-3 h-3" />
            </button>
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
                        <h4 className="text-xs font-medium text-[#2b2b2b] group-hover:text-[#00a97f] transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-[10px] text-gray-500">
                          Friends since {member.date}
                        </p>
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
                <p className="text-xs text-gray-500 px-4">
                  You don't have any friends added yet.
                </p>
                <button className="text-xs font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors cursor-pointer">
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