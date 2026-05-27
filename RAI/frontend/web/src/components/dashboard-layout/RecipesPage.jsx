import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, Flame, Star, BookOpen, ChefHat } from 'lucide-react';
import recipesMock from "../../data/recipesMock";
import RecipeCategories from "./RecipeCategories";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";

const categoryConfig = {
  my_collection: { label: "My Collection", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  high_protein: { label: "High Protein", icon: Flame, color: "text-[#00a97f]", bg: "bg-[#e6f7f2]" },
  my_favorites: { label: "Most Popular", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  all_recipes: { label: "All Recipes", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
};

const getUniqueRecipesByUrl = (recipes) => {
  const uniqueRecipes = new Map();
  recipes.forEach((recipe) => {
    if (recipe?.url && !uniqueRecipes.has(recipe.url)) {
      uniqueRecipes.set(recipe.url, recipe);
    }
  });
  return Array.from(uniqueRecipes.values());
};

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const [likedRecipeUrls, setLikedRecipeUrls] = useState(() => {
    try {
      const savedCollection = localStorage.getItem("gymmerRecipeCollection");
      return savedCollection ? JSON.parse(savedCollection) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("gymmerRecipeCollection", JSON.stringify(likedRecipeUrls));
  }, [likedRecipeUrls]);

  const categories = ["my_collection", "high_protein", "my_favorites", "all_recipes"];

  const allUniqueRecipes = useMemo(() => {
    return getUniqueRecipesByUrl([
      ...(recipesMock.high_protein || []),
      ...(recipesMock.my_favorites || []),
      ...(recipesMock.all_recipes || []),
    ]);
  }, []);

  const recipesByUrl = useMemo(() => {
    return new Map(allUniqueRecipes.map((recipe) => [recipe.url, recipe]));
  }, [allUniqueRecipes]);

  const myCollectionRecipes = likedRecipeUrls
    .map((url) => recipesByUrl.get(url))
    .filter(Boolean);

  const recipes =
    selectedCategory === "my_collection"
      ? myCollectionRecipes
      : selectedCategory
        ? recipesMock[selectedCategory] || []
        : [];

  const visibleRecipes = recipes.slice(0, visibleCount);

  const openCategory = (category) => {
    setSelectedCategory(category);
    setSelectedRecipe(null);
    setVisibleCount(12);
  };

  const toggleRecipeLike = (recipe) => {
    setLikedRecipeUrls((currentUrls) => {
      const isAlreadyLiked = currentUrls.includes(recipe.url);
      if (isAlreadyLiked) {
        return currentUrls.filter((url) => url !== recipe.url);
      }
      return [recipe.url, ...currentUrls];
    });
  };

  const isRecipeLiked = (recipe) => likedRecipeUrls.includes(recipe.url);

  return (
    <div className="flex flex-col w-full h-full bg-[#ffffff] font-sans text-[#2b2b2b] p-6 overflow-hidden">
      <header className="flex-shrink-0 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {selectedRecipe 
              ? "Recipe Details" 
              : selectedCategory 
                ? categoryConfig[selectedCategory].label 
                : "Recipe Hub"}
          </h1>
          <p className="text-sm text-gray-500">
            {selectedRecipe 
              ? "Everything you need to prep this meal" 
              : selectedCategory 
                ? "Discover and manage your meals" 
                : "Explore delicious and healthy meals"}
          </p>
        </div>

        {(selectedCategory || selectedRecipe) && (
          <button
            onClick={() => selectedRecipe ? setSelectedRecipe(null) : setSelectedCategory(null)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {selectedRecipe ? "Back to List" : "Back to Categories"}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: CATEGORIES */}
          {!selectedCategory && (
            <RecipeCategories 
              categories={categories} 
              categoryConfig={categoryConfig} 
              myCollectionCount={myCollectionRecipes.length}
              onOpenCategory={openCategory} 
            />
          )}

          {/* VIEW 2: RECIPE LIST */}
          {selectedCategory && !selectedRecipe && (
            <motion.div
              key="recipe-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {recipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[250px] border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <ChefHat className="w-10 h-10 text-gray-400 mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">No recipes found</h3>
                  <p className="text-sm text-gray-500">
                    {selectedCategory === "my_collection"
                      ? "Click the heart icon on any recipe to save it here."
                      : "There are currently no recipes available in this category."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visibleRecipes.map((recipe) => (
                      <RecipeCard 
                        key={recipe.url}
                        recipe={recipe}
                        liked={isRecipeLiked(recipe)}
                        onToggleLike={toggleRecipeLike}
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>

                  {visibleCount < recipes.length && (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={() => setVisibleCount((c) => c + 12)}
                        className="px-6 py-2.5 border border-gray-200 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00a97f] transition-colors shadow-sm"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* VIEW 3: RECIPE DETAIL */}
          {selectedRecipe && (
            <RecipeDetail 
              recipe={selectedRecipe} 
              liked={isRecipeLiked(selectedRecipe)}
              onToggleLike={toggleRecipeLike}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}