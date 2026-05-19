import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Plus } from 'lucide-react';
import AddFoodModal from './AddFoodModal';

export default function MealsTab() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast'); // Default je zajtrk

  const getHeaders = useCallback(() => ({
    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    "Content-Type": "application/json"
  }), []);

  const fetchMealsData = useCallback(async () => {
    setLoading(true);
    try {
      // Kličemo dashboard, ki vrne današnje podatke
      const res = await fetch("http://127.0.0.1:8000/users/me/dashboard", { headers: getHeaders() });
      if (res.ok) setDashboardData(await res.json());
    } catch (err) {
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchMealsData();
  }, [fetchMealsData]);

  const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'unspecified'];

  if (loading) return <div className="text-[var(--text-primary)]">Loading today's meals...</div>;

  const currentMealData = dashboardData?.meals?.[selectedMealType] || { entries: [], total_calories: 0 };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl text-[var(--text-primary)] font-bold tracking-wide">Today's Meals</h3>
      </div>

      {/* GUMBI ZA IZBIRO OBROKA */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {meals.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMealType(m)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${selectedMealType === m ? 'bg-[var(--accent)] text-[var(--text-inverse)]' : 'bg-[var(--surface-dark)] text-[var(--muted)] hover:bg-[var(--surface)]'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* PRIKAZ IZBRANEGA OBROKA */}
      <div className="flex-1 bg-[var(--surface-dark)] border border-[var(--border)] rounded-2xl p-6 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-2xl text-[var(--text-primary)] font-bold capitalize">{selectedMealType}</h4>
            <p className="text-sm text-[var(--accent)]">{Math.round(currentMealData.total_calories)} kcal total</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[var(--accent)] text-[var(--text-inverse)] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[var(--accent-hover)] transition-all cursor-pointer">
            <Plus className="h-4 w-4" /> Add Food
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {currentMealData.entries?.length > 0 ? (
            currentMealData.entries.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]">
                <div>
                  <p className="text-[var(--text-primary)] text-sm font-medium">{entry.food?.name}</p>
                  <p className="text-[var(--muted)] text-xs">{entry.quantity_g}g</p>
                </div>
                <span className="text-[var(--text-primary)] font-bold text-sm bg-[var(--surface-dark)] px-3 py-1 rounded-lg">
                  {Math.round(entry.calories)} kcal
                </span>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] border-2 border-dashed border-[var(--border)] rounded-2xl">
              <Utensils className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No food logged for {selectedMealType} yet.</p>
            </div>
          )}
        </div>
      </div>

      <AddFoodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mealType={selectedMealType} 
        onFoodAdded={fetchMealsData} 
      />
    </motion.div>
  );
}