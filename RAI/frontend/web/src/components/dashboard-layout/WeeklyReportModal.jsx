import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, X } from 'lucide-react';

export default function WeeklyReportModal({ isOpen, onClose, weeklyData, totalHoursDisplay }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#00a97f]" />
                Weekly Report Summary
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Active Time</p>
                <h1 className="text-4xl font-bold text-[#00a97f]">{totalHoursDisplay} <span className="text-lg text-gray-400 font-normal">hours</span></h1>
                <p className="text-xs text-gray-400 mt-2">You've hit your daily goal 3 times this week!</p>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-6">
                {Object.entries(weeklyData).map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 w-10">{day}</span>
                    <div className="flex-1 mx-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#00a97f] h-full rounded-full" 
                        style={{ width: `${Math.min((time / 60) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-700 w-12 text-right">{time}m</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}