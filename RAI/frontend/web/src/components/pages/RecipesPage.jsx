import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import recipesMock from "../../data/recipesMock";

const categoryLabels = {
  high_protein: "High Protein",
  my_favorites: "My Favorites",
  all_recipes: "All Recipes",
};

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const categories = Object.keys(recipesMock);
  const recipes = selectedCategory ? recipesMock[selectedCategory] || [] : [];
  const visibleRecipes = recipes.slice(0, visibleCount);

  const openCategory = (category) => {
    setSelectedCategory(category);
    setSelectedRecipe(null);
    setVisibleCount(10);
  };

  const backToCategories = () => {
    setSelectedCategory(null);
    setSelectedRecipe(null);
  };

  const backToRecipes = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_center,_#3a3a3a_0%,_#111111_70%,_#050505_100%)] text-white px-6 py-10 font-mono">
      <div className="max-w-6xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl mb-10"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          RECIPES
        </motion.h1>

        <AnimatePresence mode="wait">
          {!selectedCategory && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openCategory(category)}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 text-left shadow-2xl hover:border-blue-500 transition"
                >
                  <h2 className="text-2xl mb-3 text-white">
                    {categoryLabels[category]}
                  </h2>
                  <p className="text-gray-400">
                    Browse {categoryLabels[category].toLowerCase()} recipes.
                  </p>
                </motion.button>
              ))}
            </motion.div>
          )}

          {selectedCategory && !selectedRecipe && (
            <motion.div
              key="recipe-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                onClick={backToCategories}
                className="mb-6 text-blue-400 hover:text-blue-300"
              >
                ← Back to categories
              </button>

              <h2 className="text-3xl mb-6">
                {categoryLabels[selectedCategory]}
              </h2>

              <div className="flex flex-col gap-5">
                {visibleRecipes.map((recipe) => (
                  <motion.button
                    key={recipe.url}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="flex gap-5 items-center bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-4 text-left hover:border-blue-500 transition"
                  >
                    {recipe.image_url && (
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-28 h-28 object-cover rounded-2xl"
                      />
                    )}

                    <div>
                      <h3 className="text-xl text-white">{recipe.title}</h3>
                      <p className="text-gray-400 mt-2">
                        {recipe.calories || "N/A"} kcal · {recipe.protein || "N/A"} g protein
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {visibleCount < recipes.length && (
                <button
                  onClick={() => setVisibleCount((count) => count + 10)}
                  className="mt-8 bg-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-blue-500 transition"
                >
                  More
                </button>
              )}
            </motion.div>
          )}

          {selectedRecipe && (
            <motion.div
              key="recipe-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl"
            >
              <button
                onClick={backToRecipes}
                className="mb-6 text-blue-400 hover:text-blue-300"
              >
                ← Back to recipes
              </button>

              <h2 className="text-4xl mb-4">{selectedRecipe.title}</h2>

              {selectedRecipe.image_url && (
                <img
                  src={selectedRecipe.image_url}
                  alt={selectedRecipe.title}
                  className="w-full max-h-[360px] object-cover rounded-3xl mb-8"
                />
              )}

              <section className="mb-8">
                <h3 className="text-2xl mb-3 text-blue-400">Nutrition</h3>
                <p>{selectedRecipe.calories || "N/A"} kcal</p>
                <p>{selectedRecipe.protein || "N/A"} g protein</p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl mb-3 text-blue-400">Ingredients</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  {selectedRecipe.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-2xl mb-3 text-blue-400">Instructions</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                  {selectedRecipe.instructions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}