from dataclasses import asdict

from app.core.database import get_db
from app.models.recipe import NutritionalValues, Recipe

RECIPES_COLLECTION = "recipes"


def _recipe_from_document(document: dict) -> Recipe:
    nutrition = document["nutritional_values"]

    return Recipe(
        id=document["id"],
        title=document["title"],
        url=document["url"],
        image_url=document["image_url"],
        categories=document["categories"],
        ingredients=document["ingredients"],
        instructions=document["instructions"],
        nutritional_values=NutritionalValues(
            calories=nutrition["calories"],
            protein_g=nutrition["protein_g"],
            carbs_g=nutrition["carbs_g"],
            fat_g=nutrition["fat_g"],
        ),
    )


def _recipe_to_document(recipe: Recipe) -> dict:
    return asdict(recipe)


class RecipeService:
    @property
    def collection(self):
        return get_db()[RECIPES_COLLECTION]

    async def list_recipes(
        self,
        category: str | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> tuple[list[Recipe], bool]:
        query = {}

        if category is not None:
            query["categories"] = category

        skip = (page - 1) * limit

        documents = (
            await self.collection
            .find(query)
            .skip(skip)
            .limit(limit + 1)
            .to_list(limit + 1)
        )

        has_more = len(documents) > limit
        documents = documents[:limit]

        recipes = [_recipe_from_document(document) for document in documents]

        return recipes, has_more

    async def get_recipe_by_id(self, recipe_id: str) -> Recipe | None:
        document = await self.collection.find_one({"id": recipe_id})

        if document is None:
            return None

        return _recipe_from_document(document)