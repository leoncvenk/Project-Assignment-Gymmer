import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import recipesMock from "../../data/recipesMock";

const categoryLabels = {
  high_protein: "High Protein",
  my_favorites: "Favorites",
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
    <div className="min-h-screen w-full bg-[#1f1f1f] text-white px-6 py-10 font-mono">
        <div className="max-w-7xl mx-auto">
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl mb-10 text-center"
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
                className="bg-[#464456] border border-[#666475] rounded-3xl p-8 shadow-2xl"
            >
                <h2 className="text-xl mb-6">Choose Recipe Category</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <motion.button
                    key={category}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openCategory(category)}
                    className="bg-[#1f1f1f] border border-[#5f5d6d] rounded-2xl p-8 text-left shadow-lg hover:border-[#10b981] hover:bg-[#242424] transition"
                    >
                    <h3 className="text-2xl mb-3 text-white">
                        {categoryLabels[category]}
                    </h3>
                    <p className="text-gray-300 text-sm">
                        Browse {categoryLabels[category].toLowerCase()} recipes.
                    </p>
                    </motion.button>
                ))}
                </div>
            </motion.div>
            )}

            {selectedCategory && !selectedRecipe && (
            <motion.div
                key="recipe-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#464456] border border-[#666475] rounded-3xl p-8 shadow-2xl"
            >
                <button
                onClick={backToCategories}
                className="mb-6 text-[#10b981] hover:text-[#34d399] transition"
                >
                ← Back to categories
                </button>

                <h2 className="text-3xl mb-6">
                {categoryLabels[selectedCategory]}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {visibleRecipes.map((recipe) => (
                    <motion.button
                    key={recipe.url}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="flex gap-5 items-center bg-[#1f1f1f] border border-[#5f5d6d] rounded-2xl p-4 text-left hover:border-[#10b981] hover:bg-[#242424] transition"
                    >
                    {recipe.image_url && (
                        <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                        className="w-28 h-28 object-cover rounded-xl"
                        />
                    )}

                    <div>
                        <h3 className="text-xl text-white">{recipe.title}</h3>
                        <p className="text-gray-300 mt-2 text-sm">
                        {recipe.calories || "N/A"} kcal · {recipe.protein || "N/A"} g protein
                        </p>
                    </div>
                    </motion.button>
                ))}
                </div>

                {visibleCount < recipes.length && (
                <div className="flex justify-center mt-8">
                    <button
                    onClick={() => setVisibleCount((count) => count + 10)}
                    className="bg-[#10b981] text-black px-10 py-3 rounded-xl font-bold hover:bg-[#34d399] transition"
                    >
                    More
                    </button>
                </div>
                )}
            </motion.div>
            )}

            {selectedRecipe && (
            <motion.div
                key="recipe-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#464456] border border-[#666475] rounded-3xl p-8 shadow-2xl"
            >
                <button
                onClick={backToRecipes}
                className="mb-6 text-[#10b981] hover:text-[#34d399] transition"
                >
                ← Back to recipes
                </button>

                <h2 className="text-4xl mb-6">{selectedRecipe.title}</h2>

                {selectedRecipe.image_url && (
                <img
                    src={selectedRecipe.image_url}
                    alt={selectedRecipe.title}
                    onError={(event) => {
                    event.currentTarget.style.display = "none";
                    }}
                    className="w-full max-h-[380px] object-cover rounded-2xl mb-8 border border-[#5f5d6d]"
                />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <section className="bg-[#1f1f1f] border border-[#5f5d6d] rounded-2xl p-5">
                    <h3 className="text-xl mb-3 text-[#10b981]">Nutrition</h3>
                    <p>{selectedRecipe.calories || "N/A"} kcal</p>
                    <p>{selectedRecipe.protein || "N/A"} g protein</p>
                </section>

                <section className="lg:col-span-2 bg-[#1f1f1f] border border-[#5f5d6d] rounded-2xl p-5">
                    <h3 className="text-xl mb-3 text-[#10b981]">Ingredients</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {(selectedRecipe.ingredients || []).map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    </ul>
                </section>
                </div>

                <section className="bg-[#1f1f1f] border border-[#5f5d6d] rounded-2xl p-5">
                <h3 className="text-xl mb-3 text-[#10b981]">Instructions</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-3">
                    {(selectedRecipe.instructions || []).map((item, index) => (
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