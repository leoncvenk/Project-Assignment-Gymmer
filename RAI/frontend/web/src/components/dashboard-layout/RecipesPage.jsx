import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, Flame, Star, BookOpen, ChefHat } from "lucide-react";
import RecipeCategories from "./RecipeCategories";
import RecipeCard from "./RecipeCard";
import RecipeDetail from "./RecipeDetail";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const categoryConfig = {
  my_collection: {
    label: "My Collection",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  high_protein: {
    label: "High Protein",
    icon: Flame,
    color: "text-[#00a97f]",
    bg: "bg-[#e6f7f2]",
  },
  most_popular: {
    label: "Most Popular",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  all_recipes: {
    label: "All Recipes",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
};

const categories = [
  "my_collection",
  "high_protein",
  "most_popular",
  "all_recipes",
];

const getRecipeKey = (recipe) => {
  return recipe?.id || recipe?.url;
};

const normalizeRecipe = (recipe) => {
  if (!recipe) return null;

  return {
    ...recipe,
    calories:
      recipe.calories ??
      recipe.nutritional_values?.calories ??
      null,
    protein:
      recipe.protein ??
      recipe.nutritional_values?.protein_g ??
      null,
    carbs:
      recipe.carbs ??
      recipe.nutritional_values?.carbs_g ??
      null,
    fat:
      recipe.fat ??
      recipe.nutritional_values?.fat_g ??
      null,
  };
};

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const [myCollectionRecipes, setMyCollectionRecipes] = useState(() => {
    try {
      const savedCollection = localStorage.getItem("gymmerRecipeCollection");
      return savedCollection ? JSON.parse(savedCollection) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "gymmerRecipeCollection",
      JSON.stringify(myCollectionRecipes)
    );
  }, [myCollectionRecipes]);

  const buildRecipesUrl = (category, nextPage) => {
    const params = new URLSearchParams();

    params.set("page", String(nextPage));
    params.set("limit", "8");

    if (
      category === "high_protein" ||
      category === "most_popular" ||
      category === "all_recipes"
    ) {
      params.set("category", category);
    }

    return `${API_BASE_URL}/recipes?${params.toString()}`;
  };

  const fetchRecipes = async (category, nextPage = 1) => {
    if (!category || category === "my_collection") return;

    try {
      setLoading(true);
      setError("");

      const url = buildRecipesUrl(category, nextPage);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
      }

      const data = await response.json();

      const normalizedRecipes = (data.recipes || [])
        .map(normalizeRecipe)
        .filter(Boolean);

      setRecipes((currentRecipes) =>
        nextPage === 1
          ? normalizedRecipes
          : [...currentRecipes, ...normalizedRecipes]
      );

      setPage(data.page || nextPage);
      setHasMore(Boolean(data.has_more));
    } catch (err) {
      setError("Recipes could not be loaded. Check if the backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCategory = (category) => {
    setSelectedCategory(category);
    setSelectedRecipe(null);
    setError("");
    setPage(1);
    setHasMore(false);

    if (category === "my_collection") {
      setRecipes(myCollectionRecipes);
      return;
    }

    setRecipes([]);
    fetchRecipes(category, 1);
  };

  const openRecipe = async (recipe) => {
    const normalizedRecipe = normalizeRecipe(recipe);
    setSelectedRecipe(normalizedRecipe);

    if (!recipe?.id) return;

    try {
      setDetailLoading(true);

      const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch recipe details.");
      }

      const data = await response.json();
      setSelectedRecipe(normalizeRecipe(data));
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadMoreRecipes = () => {
    if (!selectedCategory || loading || !hasMore) return;
    fetchRecipes(selectedCategory, page + 1);
  };

  const backToCategories = () => {
    setSelectedCategory(null);
    setSelectedRecipe(null);
    setRecipes([]);
    setPage(1);
    setHasMore(false);
    setError("");
  };

  const backToList = () => {
    setSelectedRecipe(null);
  };

  const toggleRecipeLike = (recipe) => {
    const normalizedRecipe = normalizeRecipe(recipe);
    const recipeKey = getRecipeKey(normalizedRecipe);

    if (!recipeKey) return;

    setMyCollectionRecipes((currentRecipes) => {
      const alreadyLiked = currentRecipes.some(
        (currentRecipe) => getRecipeKey(currentRecipe) === recipeKey
      );

      if (alreadyLiked) {
        return currentRecipes.filter(
          (currentRecipe) => getRecipeKey(currentRecipe) !== recipeKey
        );
      }

      return [normalizedRecipe, ...currentRecipes];
    });
  };

  const isRecipeLiked = (recipe) => {
    const recipeKey = getRecipeKey(recipe);

    return myCollectionRecipes.some(
      (currentRecipe) => getRecipeKey(currentRecipe) === recipeKey
    );
  };

  const displayedRecipes =
    selectedCategory === "my_collection" ? myCollectionRecipes : recipes;

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
              ? detailLoading
                ? "Loading full recipe details..."
                : "Everything you need to prep this meal"
              : selectedCategory
                ? "Discover and manage your meals"
                : "Explore delicious and healthy meals"}
          </p>
        </div>

        {(selectedCategory || selectedRecipe) && (
          <button
            onClick={selectedRecipe ? backToList : backToCategories}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {selectedRecipe ? "Back to List" : "Back to Categories"}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
        <AnimatePresence mode="wait">
          {!selectedCategory && (
            <RecipeCategories
              categories={categories}
              categoryConfig={categoryConfig}
              myCollectionCount={myCollectionRecipes.length}
              onOpenCategory={openCategory}
            />
          )}

          {selectedCategory && !selectedRecipe && (
            <motion.div
              key="recipe-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading && displayedRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[250px] border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <ChefHat className="w-10 h-10 text-gray-400 mb-3 animate-pulse" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">
                    Loading recipes...
                  </h3>
                  <p className="text-sm text-gray-500">
                    Fetching data from the backend API.
                  </p>
                </div>
              ) : displayedRecipes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[250px] border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <ChefHat className="w-10 h-10 text-gray-400 mb-3" />
                  <h3 className="text-base font-semibold text-gray-700 mb-1">
                    {selectedCategory === "my_collection"
                      ? "Your collection is empty"
                      : "No recipes found"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedCategory === "my_collection"
                      ? "Click the heart icon on any recipe to save it here."
                      : "There are currently no recipes available in this category."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedRecipes.map((recipe) => (
                      <RecipeCard
                        key={getRecipeKey(recipe)}
                        recipe={recipe}
                        liked={isRecipeLiked(recipe)}
                        onToggleLike={toggleRecipeLike}
                        onClick={() => openRecipe(recipe)}
                      />
                    ))}
                  </div>

                  {selectedCategory !== "my_collection" && hasMore && (
                    <div className="flex justify-center mt-10">
                      <button
                        onClick={loadMoreRecipes}
                        disabled={loading}
                        className="px-6 py-2.5 border border-gray-200 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00a97f] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

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