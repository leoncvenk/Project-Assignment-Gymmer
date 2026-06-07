import React, { useEffect, useState } from 'react';
import {
  Calendar,
  UserPlus,
  Edit3,
  ArrowUpRight,
  Activity,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const RANGE_OPTIONS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "12 months", value: "12m" },
];

export default function HomeScreen({ setActiveTab }) {
  const friends = [];

  const [selectedRange, setSelectedRange] = useState("7d");
  const [activityPoints, setActivityPoints] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    steps: 0,
    caloriesBurned: 0,
    activeMinutes: 0,
    averageHeartRate: 0,
  });

  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const fetchHomeDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      setDashboardError("");

      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No authentication token found.");
      }

      const activityResponse = await fetch(
        `${API_BASE_URL}/users/me/activity/history?range=${selectedRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!activityResponse.ok) {
        throw new Error("Failed to fetch activity history.");
      }

      const activityData = await activityResponse.json();

      setDashboardStats({
        steps: activityData.total_steps || 0,
        caloriesBurned: 0,
        activeMinutes: activityData.total_active_minutes || 0,
        averageHeartRate: 0,
      });

      setActivityPoints(activityData.points || []);

      const recipesResponse = await fetch(
        `${API_BASE_URL}/recipes?category=high_protein&page=1&limit=2`
      );

      if (!recipesResponse.ok) {
        throw new Error("Failed to fetch recipes.");
      }

      const recipesData = await recipesResponse.json();
      setTrendingRecipes(recipesData.recipes || []);
    } catch (err) {
      console.error(err);
      setDashboardError("Dashboard data could not be loaded.");
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchHomeDashboardData();
  }, [selectedRange]);

  const chartValues = activityPoints.map((point) => point.steps || 0);
  const maxSteps = Math.max(...chartValues, 1);

  const chartPoints = activityPoints
    .map((point, index) => {
      const x =
        activityPoints.length > 1
          ? (index / (activityPoints.length - 1)) * 100
          : 50;

      const y = 100 - ((point.steps || 0) / maxSteps) * 75 - 10;

      return `${x},${y}`;
    })
    .join(" ");

  const chartDots = activityPoints
  .map((point, index) => {
    const steps = point.steps || 0;

    if (steps <= 0) return null;

    const x =
      activityPoints.length > 1
        ? (index / (activityPoints.length - 1)) * 100
        : 50;

    const y = 100 - (steps / maxSteps) * 75 - 10;

    return {
      x,
      y,
      date: point.date,
      steps,
    };
  })
  .filter(Boolean);

  const hasActivityData = chartValues.some((value) => value > 0);

  return (
    <div className="flex flex-col w-full h-full bg-[#ffffff] font-sans text-[#2b2b2b] p-6 overflow-hidden">
      {/* Header Section */}
      <header className="flex-shrink-0 flex items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-semibold mb-3">Dashboard</h1>

          <div className="inline-flex rounded-md border border-gray-200 bg-white shadow-sm p-0.5">
            {RANGE_OPTIONS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedRange(tab.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedRange === tab.value
                    ? "bg-gray-100 text-[#2b2b2b] shadow-sm"
                    : "text-gray-500 hover:text-[#2b2b2b]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            {selectedRange === "7d" && "Last 7 days"}
            {selectedRange === "30d" && "Last 30 days"}
            {selectedRange === "12m" && "Last 12 months"}
          </div>
        </div>
      </header>

      {dashboardError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {dashboardError}
        </div>
      )}

      {loadingDashboard && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Loading dashboard data...
        </div>
      )}

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

              {dashboardStats.steps > 0 && (
                <span className="text-[10px] font-semibold text-[#00a97f] bg-[#e6f7f2] px-2 py-0.5 rounded-full">
                  synced
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-[130px] relative mt-2">
            {activityPoints.length > 0 ? (
              <div className="h-full min-h-[130px] rounded-lg border border-gray-100 bg-white relative px-4 pt-2 pb-6">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-x-4 top-2 bottom-8 w-[calc(100%-2rem)] h-[calc(100%-2.5rem)]"
                >
                  {hasActivityData && (
                    <polyline
                      points={chartPoints}
                      fill="none"
                      stroke="#00a97f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </svg>

                {/* okrogle pike za dneve, kjer so koraki */}
                <div className="absolute inset-x-4 top-2 bottom-8">
                  {chartDots.map((dot) => (
                    <div
                      key={dot.date}
                      className="absolute w-3 h-3 rounded-full bg-[#00a97f] border-2 border-white shadow-sm"
                      style={{
                        left: `${dot.x}%`,
                        top: `${dot.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`${dot.steps.toLocaleString()} steps`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-gray-400">
                  {activityPoints.map((point, index) => (
                    <span key={`${point.label}-${index}`}>
                      {selectedRange === "30d" && index % 3 !== 0 ? "" : point.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[130px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400">
                No activity data available yet.
              </div>
            )}
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
            onClick={() => setActiveTab?.("activities")}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white group-hover:bg-gray-50">
              <UserPlus className="w-4 h-4 text-gray-600" />
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#2b2b2b]">
                Log a Workout
              </h4>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Manually enter your recent activity
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab?.("nutrition")}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all bg-white text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 bg-white group-hover:bg-gray-50">
              <Edit3 className="w-4 h-4 text-gray-600" />
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#2b2b2b]">
                Add a Meal
              </h4>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Track your calories and macros
              </p>
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

            <button
              onClick={() => setActiveTab?.("meals")}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors group cursor-pointer"
            >
              All recipes
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          <div className="flex-1 min-h-0 rounded-xl border border-gray-200 bg-white overflow-hidden">
            {trendingRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 h-full">
                {trendingRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => setActiveTab?.("meals")}
                    className="group flex flex-col text-left overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-[#00a97f] hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="h-72 w-full overflow-hidden bg-gray-100">
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-3 flex-1">
                      <p className="text-[10px] font-semibold text-[#00a97f] mb-1">
                        High Protein • Recipe
                      </p>

                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold text-[#2b2b2b] line-clamp-2">
                          {recipe.title}
                        </h4>

                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00a97f] flex-shrink-0 mt-0.5" />
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 border border-orange-100 text-[10px] font-medium text-orange-600">
                          <Flame className="w-3 h-3" />
                          {recipe.nutritional_values?.calories ?? 0} kcal
                        </span>

                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#e6f7f2] border border-[#bdeade] text-[10px] font-medium text-[#008a68]">
                          <Activity className="w-3 h-3" />
                          {recipe.nutritional_values?.protein_g ?? 0}g Pro
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-sm font-semibold text-[#2b2b2b]">
                  No trending recipes yet.
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Recipes will appear here once real recipe data is available.
                </p>

                <button
                  onClick={() => setActiveTab?.("meals")}
                  className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors cursor-pointer"
                >
                  Browse recipes
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Friends List / Empty State */}
        <div className="w-[240px] flex flex-col flex-shrink-0 overflow-hidden">
          <h3 className="text-xs font-semibold mb-3 flex-shrink-0">Friends</h3>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {friends.length > 0 ? (
              <div className="space-y-3">
                {friends.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between group cursor-pointer"
                  >
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
                <span className="text-4xl" role="img" aria-label="sad">
                  😔
                </span>

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