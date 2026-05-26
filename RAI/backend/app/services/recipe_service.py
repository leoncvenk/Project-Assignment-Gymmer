from app.models.recipe import NutritionalValues, Recipe


class RecipeService:
    def __init__(self):
        self.recipes = [
            Recipe(
                id="ground-turkey-chili",
                title="Ground Turkey Chili",
                url="https://healthyfitnessmeals.com/ground-turkey-chili/",
                image_url="https://healthyfitnessmeals.com/wp-content/uploads/2023/09/Ground-turkey-chili-8.jpg",
                categories=["high_protein", "most_popular"],
                ingredients=[
                    "1 tablespoon olive oil",
                    "1 medium onion",
                    "1 pound ground turkey",
                    "2 cups crushed tomatoes",
                ],
                instructions=[
                    "Heat olive oil in a large pot.",
                    "Add onion and cook until softened.",
                    "Add ground turkey and cook until browned.",
                    "Add tomatoes and simmer until thickened.",
                ],
                nutritional_values=NutritionalValues(
                    calories=444,
                    protein_g=37,
                    carbs_g=20,
                    fat_g=12,
                ),
            )
        ]

    async def list_recipes(
        self,
        category: str | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[list[Recipe], bool]:
        recipes = self.recipes

        if category is not None:
            recipes = [
                recipe
                for recipe in recipes
                if category in recipe.categories
            ]

        start = (page - 1) * limit
        end = start + limit

        paginated_recipes = recipes[start:end]
        has_more = end < len(recipes)

        return paginated_recipes, has_more

    async def get_recipe_by_id(self, recipe_id: str) -> Recipe | None:
        for recipe in self.recipes:
            if recipe.id == recipe_id:
                return recipe

        return None