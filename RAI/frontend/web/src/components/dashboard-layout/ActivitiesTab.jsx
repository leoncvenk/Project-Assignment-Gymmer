import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import ActivityForm from './ActivityForm';
import ActivityFeed from './ActivityFeed';
import WeeklyStatsCard from './WeeklyStatsCard';
import WeeklyPlanCard from './WeeklyPlanCard';
import ActivityDetailsModal from './ActivityDetailsModal';
import WeeklyReportModal from './WeeklyReportModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getTodayShortName = () => {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
};

export default function ActivitiesTab({ userData }) {
  const [isLogging, setIsLogging] = useState(false);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [isViewingReport, setIsViewingReport] = useState(false);

  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");

  const [weeklyData, setWeeklyData] = useState({
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
  });

  const [activities, setActivities] = useState([]);

  const [weeklyPlan, setWeeklyPlan] = useState([]);

  const handleSaveActivity = (newActivity, durationNum, formDay) => {
    setActivities([newActivity, ...activities]);
    if (durationNum > 0) {
      setWeeklyData(prev => ({ ...prev, [formDay]: prev[formDay] + durationNum }));
    }
    setIsLogging(false);
  };

  const deleteActivity = (id) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      const dayMatch = activity.date.split(',')[0];
      const durMatch = parseInt(activity.duration);
      if (daysOfWeek.includes(dayMatch) && durMatch) {
        setWeeklyData(prev => ({
          ...prev,
          [dayMatch]: Math.max(0, prev[dayMatch] - durMatch)
        }));
      }
    }
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleAddPlan = (newPlan) => setWeeklyPlan([...weeklyPlan, newPlan]);

  const togglePlanItem = (id) => {
    setWeeklyPlan(prevPlan => 
      prevPlan.map(item => item.id === id ? { ...item, completed: !item.completed, current: false } : item)
    );
  };

  const deletePlanItem = (id) => {
    setWeeklyPlan(prev => prev.filter(item => item.id !== id));
  };

  const fetchTodayActivity = async () => {
    try {
      setActivityLoading(true);
      setActivityError("");

      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/users/me/activity/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activity.");
      }

      const data = await response.json();

      const today = getTodayShortName();

      setWeeklyData((prev) => ({
        ...prev,
        [today]: data.active_minutes || 0,
      }));

      if ((data.steps || 0) > 0 || (data.distance_meters || 0) > 0 || (data.active_minutes || 0) > 0) {
        setActivities([
          {
            id: data.id,
            title: "Daily Steps",
            type: "Steps",
            date: data.date || new Date().toISOString().split("T")[0],
            duration: `${data.active_minutes || 0} min`,
            steps: data.steps || 0,
            distance_meters: data.distance_meters || 0,
            active_minutes: data.active_minutes || 0,
          },
        ]);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error(err);
      setActivityError("Activity data could not be loaded.");
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
  fetchTodayActivity();
  }, []);

  const totalMinutes = Object.values(weeklyData).reduce((a, b) => a + b, 0);
  const totalHoursDisplay = (totalMinutes / 60).toFixed(1);

  return (
    <div className="flex flex-col w-full h-full bg-[#ffffff] font-sans text-[#2b2b2b] p-6 overflow-hidden relative">
      
      <header className="flex-shrink-0 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold mb-1">Activities</h1>
          <p className="text-xs text-gray-500">Track your workouts, analyze progress, and plan your week.</p>
        </div>
        {!isLogging && (
          <button 
            onClick={() => setIsLogging(true)}
            className="flex items-center gap-2 bg-[#00a97f] hover:bg-[#008a68] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Workout
          </button>
        )}
      </header>

      {activityError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {activityError}
        </div>
      )}

      {activityLoading && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Loading activity data...
        </div>
      )}

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        <div className="flex-[3] flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-10">
          <AnimatePresence>
            {isLogging && (
              <ActivityForm 
                onClose={() => setIsLogging(false)} 
                onSave={handleSaveActivity} 
              />
            )}
          </AnimatePresence>

          <ActivityFeed 
            activities={activities} 
            userData={userData} 
            onDelete={deleteActivity} 
            onViewDetails={setViewingActivity} 
          />
        </div>

        <div className="flex-[2] flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
          <WeeklyStatsCard 
            weeklyData={weeklyData} 
            totalHoursDisplay={totalHoursDisplay} 
            onViewReport={() => setIsViewingReport(true)} 
          />
          
          <WeeklyPlanCard 
            weeklyPlan={weeklyPlan} 
            onAddPlan={handleAddPlan}
            onToggleItem={togglePlanItem}
            onDeleteItem={deletePlanItem}
          />
        </div>
      </div>

      <ActivityDetailsModal 
        activity={viewingActivity} 
        onClose={() => setViewingActivity(null)} 
      />

      <WeeklyReportModal 
        isOpen={isViewingReport} 
        onClose={() => setIsViewingReport(false)} 
        weeklyData={weeklyData} 
        totalHoursDisplay={totalHoursDisplay} 
      />
    </div>
  );
}