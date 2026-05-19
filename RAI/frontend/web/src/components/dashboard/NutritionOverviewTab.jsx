import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

export default function NutritionOverviewTab() {
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getHeaders = useCallback(() => ({
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  }), []);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const [dashRes, weeklyRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/users/me/dashboard", { headers: getHeaders() }),
          fetch("http://127.0.0.1:8000/users/me/dashboard/weekly", { headers: getHeaders() })
        ]);

        if (dashRes.ok) setDashboardData(await dashRes.json());
        if (weeklyRes.ok) setWeeklyData(await weeklyRes.json());
      } catch (err) {
        console.error("Error fetching nutrition trends:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutritionData();
  }, [getHeaders]);

  if (loading) return <div className="text-[var(--text-primary)]">Loading trends...</div>;

  const summary = dashboardData?.summary || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
      {/* 1. KARTICE MAKROHRANIL */}
      <div>
        <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide mb-4">Today's Nutrition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: summary.calories, unit: "kcal", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Proteins", value: summary.protein, unit: "g", icon: Beef, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Carbs", value: summary.carbs, unit: "g", icon: Wheat, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { label: "Fats", value: summary.fat, unit: "g", icon: Droplet, color: "text-blue-500", bg: "bg-blue-500/10" }
          ].map((macro, i) => (
            <div key={i} className="bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${macro.bg}`}>
                <macro.icon className={`h-6 w-6 ${macro.color}`} />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">{macro.label}</p>
                <p className="text-xl text-[var(--text-primary)] font-bold">{Math.round(macro.value)} <span className="text-sm font-normal text-[var(--muted)]">{macro.unit}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. WEEKLY TRENDS */}
      <div>
        <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide mb-4">Weekly Trends (Mon-Sun)</h3>
        <div className="bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Calories", total: weeklyData?.total_calories || 0, avg: weeklyData?.avg_calories || 0, unit: "kcal" },
              { label: "Proteins", total: weeklyData?.total_protein || 0, avg: weeklyData?.avg_protein || 0, unit: "g" },
              { label: "Carbs", total: weeklyData?.total_carbs || 0, avg: weeklyData?.avg_carbs || 0, unit: "g" },
              { label: "Fats", total: weeklyData?.total_fat || 0, avg: weeklyData?.avg_fat || 0, unit: "g" }
            ].map((trend, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm text-[var(--text-primary)] font-bold">{trend.label}</p>
                <p className="text-xs text-[var(--muted)]">Total: {Math.round(trend.total)}{trend.unit}</p>
                <p className="text-xs text-[var(--accent)] font-medium">Avg: {Math.round(trend.avg)}{trend.unit}/day</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}