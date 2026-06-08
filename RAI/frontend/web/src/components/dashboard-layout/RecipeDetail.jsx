import { motion } from "framer-motion";
import { Heart, ExternalLink, Flame, CheckCircle2, ChefHat, List, Clock } from "lucide-react";

export default function RecipeDetail({ recipe, liked, onToggleLike }) {
  return (
    <motion.div
      key="recipe-detail"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col max-w-5xl mx-auto w-full pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#2b2b2b] leading-tight mb-5">
            {recipe.title}
          </h2>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-bold text-[#2b2b2b]">{recipe.calories || "--"} <span className="text-sm font-medium text-gray-500">kcal</span></span>
              </div>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00a97f]" />
                <span className="text-lg font-bold text-[#2b2b2b]">{recipe.protein || "--"} <span className="text-sm font-medium text-gray-500">g protein</span></span>
              </div>
            </div>

            {recipe.url && (
              <a
                href={recipe.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#00a97f] text-white text-sm font-bold rounded-xl hover:bg-[#008a68] transition-colors shadow-sm"
              >
                View Original Source <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggleLike(recipe)}
          className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:bg-rose-50 hover:border-rose-200 transition-colors flex-shrink-0 group"
        >
          <motion.div
            initial={false}
            animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
          >
            <Heart 
              className="w-7 h-7 transition-colors"
              fill={liked ? "#f43f5e" : "none"}
              color={liked ? "#f43f5e" : "#9ca3af"}
            />
          </motion.div>
        </motion.button>
      </div>

      <div className="w-full bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 mb-12 relative flex items-center justify-center" style={{ height: '400px' }}>
        <ChefHat className="w-20 h-20 text-gray-200 absolute" />
        {(recipe.image_url || recipe.image) && (
          <img
            src={recipe.image_url || recipe.image}
            alt={recipe.title}
            onError={(e) => { e.currentTarget.style.opacity = '0'; }}
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-6 text-[#2b2b2b] pb-4 border-b border-gray-100">
              <List className="w-6 h-6 text-[#00a97f]" /> Ingredients
            </h3>
            <ul className="flex flex-col gap-4">
              {(recipe.ingredients || []).map((item, index) => (
                <li key={index} className="flex items-start text-base text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#00a97f] mt-2 flex-shrink-0 mr-4 opacity-80"></div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold flex items-center gap-3 mb-8 text-[#2b2b2b] pb-4 border-b border-gray-100">
              <Clock className="w-6 h-6 text-[#00a97f]" /> Step-by-Step Instructions
            </h3>
            <div className="flex flex-col gap-8">
              {(recipe.instructions || []).map((item, index) => (
                <div key={index} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e6f7f2] text-[#00a97f] flex items-center justify-center text-base font-bold border border-[#00a97f]/20 group-hover:bg-[#00a97f] group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed pt-1.5">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}