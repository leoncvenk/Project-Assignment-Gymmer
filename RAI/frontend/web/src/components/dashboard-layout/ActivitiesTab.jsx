import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import ActivityForm from './ActivityForm';
import ActivityFeed from './ActivityFeed';
import WeeklyStatsCard from './WeeklyStatsCard';
import WeeklyPlanCard from './WeeklyPlanCard';
import ActivityDetailsModal from './ActivityDetailsModal';
import WeeklyReportModal from './WeeklyReportModal';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ActivitiesTab({ userData }) {
  const [isLogging, setIsLogging] = useState(false);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [isViewingReport, setIsViewingReport] = useState(false);

  const [weeklyData, setWeeklyData] = useState({
    Mon: 45, Tue: 60, Wed: 30, Thu: 90, Fri: 0, Sat: 120, Sun: 45
  });

  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'Morning Run & Sprints',
      type: 'Cardio',
      duration: '45 min',
      calories: 420,
      feeling: '🤩',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800',
      description: 'Felt amazing today! Pushed my limits on the last 2km. The weather was perfect for an outdoor session.',
      date: 'Wed, 07:30 AM',
      shared: true
    },
    {
      id: 2,
      title: 'Upper Body Power',
      type: 'Strength',
      duration: '60 min',
      calories: 310,
      feeling: '🙂',
      image: null,
      description: 'Focused on bench press and overhead presses. Hit a new PR on the incline bench!',
      date: 'Tue, 18:15 PM',
      shared: false
    }
  ]);

  const [weeklyPlan, setWeeklyPlan] = useState([
    { id: 1, day: 'Monday', title: 'Legs & Core', desc: 'Squats, Lunges, Planks • 45 min', completed: true, current: false },
    { id: 2, day: 'Wednesday', title: 'Cardio & HIIT', desc: 'Sprints, Burpees, Jump Rope • 30 min', completed: false, current: true },
    { id: 3, day: 'Friday', title: 'Upper Body Focus', desc: 'Pull-ups, Push-ups, Rows • 60 min', completed: false, current: false },
    { id: 4, day: 'Sunday', title: 'Active Recovery', desc: 'Yoga, Stretching, Light Walk • 45 min', completed: false, current: false }
  ]);

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