import React, { useState, useEffect, useCallback } from "react";
import AddFoodModal from "./AddFoodModal";
import MacroOverview from "./MacroOverview";
import WeeklyTrendsChart from "./WeeklyTrendsChart";
import MacroDonutChart from "./MacroDonutChart";
import MealDiary from "./MealDiary";

export default function NutritionMealsPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedDate, setSelectedDate] = useState('2026-05-10');

  const getHeaders = useCallback(() => ({
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  }), []);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [dashRes, weeklyRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/users/me/dashboard?date=${selectedDate}`, {
          headers: getHeaders(),
        }),
        fetch(`http://127.0.0.1:8000/users/me/dashboard/weekly?date=${selectedDate}`, {
          headers: getHeaders(),
        }),
      ]);

      if (dashRes.ok) {
        setDashboardData(await dashRes.json());
      } else {
        console.error("Dashboard request failed:", dashRes.status, await dashRes.text());
      }

      if (weeklyRes.ok) {
        setWeeklyData(await weeklyRes.json());
      } else {
        console.error("Weekly dashboard request failed:", weeklyRes.status, await weeklyRes.text());
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#00a97f] rounded-full animate-spin" />
      </div>
    );
  }

  const rawSummary = dashboardData?.summary;

  const summary = {
    calories: rawSummary?.total_calories ?? 0,
    protein: rawSummary?.total_protein_g ?? 0,
    carbs: rawSummary?.total_carbs_g ?? 0,
    fat: rawSummary?.total_fat_g ?? 0,
  };

  const mealsArray = dashboardData?.meals || [];

  const currentMealData =
    mealsArray.find((meal) => meal.meal_type === selectedMealType) || {
      meal_type: selectedMealType,
      entries: [],
      total_calories: 0,
      total_protein_g: 0,
      total_carbs_g: 0,
      total_fat_g: 0,
      entry_count: 0,
    };

  return (
    <div className="flex flex-col w-full h-full bg-[#ffffff] font-sans text-[#2b2b2b] p-6 overflow-y-auto custom-scrollbar">
      
      <header className="flex-shrink-0 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold mb-1">Nutrition & Meals</h1>
          <p className="text-xs text-gray-500">
            Track your daily intake and analyze your macro breakdown.
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#2b2b2b] outline-none focus:border-[#00a97f]"
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <MacroOverview summary={summary} />
          <WeeklyTrendsChart weeklyData={weeklyData} />
        </div>
        <MacroDonutChart summary={summary} />
      </div>

      <MealDiary 
        currentMealData={currentMealData}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealType={selectedMealType}
        selectedDate={selectedDate}
        onFoodAdded={fetchData}
      />
    </div>
  );
}