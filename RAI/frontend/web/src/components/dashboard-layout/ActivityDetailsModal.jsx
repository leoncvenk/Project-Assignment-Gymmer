import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Dumbbell, Clock, Flame } from 'lucide-react';

export default function ActivityDetailsModal({ activity, onClose }) {
  return (
    <AnimatePresence>
      {activity && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {activity.image && (
              <div className="w-full h-48 bg-gray-100 relative">
                <img src={activity.image} alt="Workout" className="w-full h-full object-cover" />
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="p-6 overflow-y-auto">
              {!activity.image && (
                <div className="flex justify-end mb-2">
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-[#2b2b2b] mb-1 flex items-center gap-2">
                {activity.title} <span>{activity.feeling}</span>
              </h2>
              <p className="text-xs text-gray-500 mb-6 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activity.date}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-[#00a97f] mb-1" />
                  <span className="text-xs text-gray-500">Type</span>
                  <span className="text-sm font-semibold">{activity.type}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center justify-center">
                  <Clock className="w-5 h-5 text-[#00a97f] mb-1" />
                  <span className="text-xs text-gray-500">Duration</span>
                  <span className="text-sm font-semibold">{activity.duration}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col items-center justify-center">
                  <Flame className="w-5 h-5 text-[#ef4444] mb-1" />
                  <span className="text-xs text-gray-500">Calories</span>
                  <span className="text-sm font-semibold">{activity.calories || 0}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2">Workout Notes</h4>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {activity.description || "No notes provided for this session."}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}