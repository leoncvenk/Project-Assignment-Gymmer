import React from "react";
import { motion } from "framer-motion";
import { Heart, ChefHat, Flame, CheckCircle2 } from "lucide-react";

export default function RecipeCard({ recipe, liked, onToggleLike, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#00a97f]/30 transition-all cursor-pointer"
    >
      <div className="relative w-full bg-gray-50 flex-shrink-0 flex items-center justify-center" style={{ height: '200px' }}>
        <ChefHat className="w-10 h-10 text-gray-200 absolute" />
        {(recipe.image_url || recipe.image) && (
          <img
            src={recipe.image_url || recipe.image}
            alt={recipe.title}
            onError={(e) => { e.currentTarget.style.opacity = '0'; }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10"
          />
        )}
        
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(recipe);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 shadow-sm z-20 group/btn"
        >
          <motion.div
            initial={false}
            animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
          >
            <Heart 
              className="w-4 h-4 transition-colors"
              fill={liked ? "#f43f5e" : "none"}
              color={liked ? "#f43f5e" : "#9ca3af"}
            />
          </motion.div>
        </motion.button>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-[#2b2b2b] mb-4 line-clamp-2 group-hover:text-[#00a97f] transition-colors">
          {recipe.title}
        </h3>
        <div className="mt-auto flex items-center gap-4 text-xs font-semibold flex-wrap">
          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-100">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            {recipe.calories || "--"} kcal
          </span>
          <span className="flex items-center gap-1.5 bg-[#e6f7f2] text-[#00a97f] px-3 py-1.5 rounded-lg border border-[#00a97f]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {recipe.protein || "--"}g Pro
          </span>
        </div>
      </div>
    </div>
  );
}