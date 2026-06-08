import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Utensils } from 'lucide-react';

export default function MealDiary({ currentMealData, selectedMealType, setSelectedMealType, onOpenModal }) {
  const meals = ['breakfast', 'lunch', 'dinner', 'snack', 'unspecified'];

  return (
    <div className="flex-1 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">Today's Diary</h2>

        <div className="inline-flex rounded-md border border-gray-200 bg-white shadow-sm p-0.5">
          {meals.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMealType(m)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                selectedMealType === m
                  ? 'bg-[#00a97f] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#2b2b2b] hover:bg-gray-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 flex flex-col min-h-0 relative">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
          <div>
            <h4 className="text-lg font-bold capitalize text-[#2b2b2b] flex items-center gap-2">
              {selectedMealType}
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {Math.round(currentMealData?.total_calories || 0)} kcal
              </span>
            </h4>
          </div>

          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-xs hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Item
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          <AnimatePresence>
            {currentMealData?.entries?.length > 0 ? (
              currentMealData.entries.map((entry, idx) => {
                const foodName =
                  entry.food?.name ||
                  entry.food_name ||
                  entry.name ||
                  'Food item';

                const calories = entry.calories ?? entry.total_calories ?? 0;
                const protein = entry.protein_g ?? entry.total_protein_g ?? 0;
                const carbs = entry.carbs_g ?? entry.total_carbs_g ?? 0;
                const fat = entry.fat_g ?? entry.total_fat_g ?? 0;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={entry.id || idx}
                    className="flex justify-between items-center bg-white p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#e6f7f2] transition-colors">
                        <Utensils className="h-4 w-4 text-gray-400 group-hover:text-[#00a97f]" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#2b2b2b] group-hover:text-[#00a97f] transition-colors">
                          {foodName}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[11px] text-gray-500 font-medium">
                            {entry.quantity_g}g
                          </p>

                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>

                          <p className="text-[10px] text-gray-400">
                            P: {Math.round(protein)}g • C: {Math.round(carbs)}g • F:{' '}
                            {Math.round(fat)}g
                          </p>
                        </div>
                      </div>
                    </div>

                    <span className="font-bold text-sm text-[#2b2b2b]">
                      {Math.round(calories)}{' '}
                      <span className="text-xs font-normal text-gray-500">kcal</span>
                    </span>
                  </motion.div>
                );
              })
            ) : (
              <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <Utensils className="h-6 w-6 mb-2 opacity-40" />
                <p className="text-xs font-medium">
                  No food logged for {selectedMealType} yet.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}