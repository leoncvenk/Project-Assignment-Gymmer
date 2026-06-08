import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Dumbbell, Clock, Flame, Share2, MoreHorizontal, Trash2, User, Footprints, Route } from 'lucide-react';

export default function ActivityFeed({ activities, userData, onDelete, onViewDetails }) {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2">
        Recent Activities
      </h3>

      <AnimatePresence>
        {activities.map(activity => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-4 flex justify-between items-start pb-3">
              <div className="flex items-center gap-3">
                {userData?.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData.username}
                    className="w-10 h-10 rounded-full border border-[#e5e5e5] object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-[#e5e5e5] flex-shrink-0">
                    <User className="w-5 h-5 text-[#c5c5c5]" />
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-[#2b2b2b]">
                    {userData?.username || "You"}{" "}
                    <span className="font-normal text-gray-500 text-xs">
                      logged a workout
                    </span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {activity.date}
                  </p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {openMenuId === activity.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenMenuId(null)}
                    ></div>

                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                      <button
                        onClick={() => {
                          onDelete(activity.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="px-4 pb-2">
              <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                {activity.title}
                {activity.feeling && (
                  <span className="text-lg" title="Feeling">
                    {activity.feeling}
                  </span>
                )}
              </h3>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f2f2f2] border border-gray-200 text-xs font-medium text-gray-700">
                  <Dumbbell className="w-3.5 h-3.5 text-[#00a97f]" /> {activity.type}
                </span>

                {activity.steps > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f2f2f2] border border-gray-200 text-xs font-medium text-gray-700">
                    <Footprints className="w-3.5 h-3.5 text-[#00a97f]" />{" "}
                    {activity.steps.toLocaleString()} steps
                  </span>
                )}

                {activity.distance_meters > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f2f2f2] border border-gray-200 text-xs font-medium text-gray-700">
                    <Route className="w-3.5 h-3.5 text-[#00a97f]" />{" "}
                    {(activity.distance_meters / 1000).toFixed(2)} km
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f2f2f2] border border-gray-200 text-xs font-medium text-gray-700">
                  <Clock className="w-3.5 h-3.5 text-[#00a97f]" /> {activity.duration}
                </span>

                {activity.calories > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#f2f2f2] border border-gray-200 text-xs font-medium text-gray-700">
                    <Flame className="w-3.5 h-3.5 text-[#ef4444]" />{" "}
                    {activity.calories} kcal
                  </span>
                )}
              </div>

              {activity.description && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {activity.description}
                </p>
              )}
            </div>

            {activity.image && (
              <div className="w-full h-64 bg-gray-100 border-y border-gray-100 overflow-hidden relative group">
                <img
                  src={activity.image}
                  alt="Workout"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={() => onViewDetails(activity)}
                className="text-xs font-semibold text-[#00a97f] hover:text-[#008a68] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                View Details
              </button>

              {activity.shared && (
                <span className="text-[10px] flex items-center gap-1 text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">
                  <Share2 className="w-3 h-3" /> Shared
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}