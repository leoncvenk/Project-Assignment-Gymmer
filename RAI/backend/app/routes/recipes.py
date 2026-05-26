from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.recipe_schema import RecipeListResponseSchema, RecipeResponseSchema
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/recipes", tags=["recipes"])

recipe_service = RecipeService()


@router.get(
    "",
    response_model=RecipeListResponseSchema,
    summary="List recipes",
    description="Returns paginated recipes, optionally filtered by category.",
)
async def list_recipes(
    category: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
):
    recipes, has_more = await recipe_service.list_recipes(
        category=category,
        page=page,
        limit=limit,
    )

    return RecipeListResponseSchema(
        recipes=recipes,
        page=page,
        limit=limit,
        has_more=has_more,
    )


@router.get(
    "/{recipe_id}",
    response_model=RecipeResponseSchema,
    summary="Get recipe by ID",
    description="Returns full recipe details for a single recipe.",
)
async def get_recipe(recipe_id: str):
    recipe = await recipe_service.get_recipe_by_id(recipe_id)

    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    return recipe