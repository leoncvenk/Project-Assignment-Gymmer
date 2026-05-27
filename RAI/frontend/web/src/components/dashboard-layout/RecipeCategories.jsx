import React from "react";
import { motion } from "framer-motion";

export default function RecipeCategories({ categories, categoryConfig, myCollectionCount, onOpenCategory }) {
  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {categories.map((category) => {
        const config = categoryConfig[category];
        const Icon = config.icon;
        return (
          <button
            key={category}
            onClick={() => onOpenCategory(category)}
            className="flex flex-col items-start p-6 border border-gray-200 rounded-xl hover:border-[#00a97f] hover:shadow-md transition-all bg-white text-left group"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${config.bg} group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${config.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-[#2b2b2b] mb-1">
              {config.label}
            </h3>
            <p className="text-sm text-gray-500">
              {category === "my_collection" ? `${myCollectionCount} saved recipes` : 'Explore recipes'}
            </p>
          </button>
        );
      })}
    </motion.div>
  );
}