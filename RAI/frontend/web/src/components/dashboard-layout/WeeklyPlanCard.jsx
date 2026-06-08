import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, CheckCircle2, Trash2 } from 'lucide-react';

export default function WeeklyPlanCard({ weeklyPlan, onAddPlan, onToggleItem, onDeleteItem }) {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [planDay, setPlanDay] = useState('Monday');
  const [planTitle, setPlanTitle] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planDuration, setPlanDuration] = useState('');

  const handleSave = () => {
    if (!planTitle.trim()) return;
    
    onAddPlan({
      id: Date.now(),
      day: planDay,
      title: planTitle,
      desc: `${planDesc}${planDuration ? ` • ${planDuration} min` : ''}`,
      completed: false,
      current: false
    });

    setIsAddingPlan(false);
    setPlanTitle('');
    setPlanDesc('');
    setPlanDuration('');
  };

  return (
    <div className="border border-gray-200 rounded-xl p-0 bg-white shadow-sm flex-shrink-0 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00a97f]" />
          Weekly Plan
        </h3>
        <button 
          onClick={() => setIsAddingPlan(!isAddingPlan)}
          className="text-[#00a97f] hover:bg-[#e6f7f2] p-1 rounded transition-colors cursor-pointer"
        >
          {isAddingPlan ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      
      <AnimatePresence>
        {isAddingPlan && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gray-50 border-b border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={planDay} 
                  onChange={(e) => setPlanDay(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 text-xs focus:border-[#00a97f] outline-none"
                >
                  <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                  <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Duration (min)" 
                  value={planDuration}
                  onChange={(e) => setPlanDuration(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 text-xs focus:border-[#00a97f] outline-none"
                />
              </div>
              <input 
                type="text" 
                placeholder="Title (e.g. Legs & Core)" 
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full border border-gray-200 rounded p-2 text-xs focus:border-[#00a97f] outline-none"
              />
              <input 
                type="text" 
                placeholder="Details (e.g. Squats, Lunges...)" 
                value={planDesc}
                onChange={(e) => setPlanDesc(e.target.value)}
                className="w-full border border-gray-200 rounded p-2 text-xs focus:border-[#00a97f] outline-none"
              />
              <button 
                onClick={handleSave}
                className="w-full bg-[#00a97f] text-white rounded p-2 text-xs font-semibold hover:bg-[#008a68] transition-colors cursor-pointer"
              >
                Add to Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col divide-y divide-gray-100">
        {weeklyPlan.length === 0 && !isAddingPlan && (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <p className="text-sm font-semibold text-[#2b2b2b]">No weekly plan yet.</p>
            <p className="mt-1 text-xs text-gray-500">
              Add your first planned workout with the plus button.
            </p>
          </div>
        )}
        
        <AnimatePresence>
          {weeklyPlan.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onClick={() => onToggleItem(item.id)}
              className={`p-4 flex items-start gap-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer group relative ${item.current ? 'border-l-2 border-[#00a97f]' : ''}`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-[#00a97f] flex-shrink-0 mt-0.5" />
              ) : (
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 bg-white ${item.current ? 'border-[#00a97f]' : 'border-gray-300'}`}></div>
              )}
              
              <div>
                <h4 className={`text-sm font-semibold transition-colors pr-6 ${item.completed ? 'line-through text-gray-400' : 'text-[#2b2b2b]'}`}>
                  {item.day} - {item.title}
                </h4>
                <p className={`text-xs mt-0.5 transition-colors pr-6 ${item.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.desc}
                </p>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="text-gray-400 hover:text-[#ef4444] p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}