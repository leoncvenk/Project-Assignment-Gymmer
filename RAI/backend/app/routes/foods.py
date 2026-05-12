from fastapi import APIRouter, HTTPException, Query

from app.schemas.food_schema import CreateFoodSchema, FoodResponseSchema, UpdateFoodSchema
from app.services.food_service import FoodService

router = APIRouter()
service = FoodService()


@router.post(
    "/foods",
    response_model=FoodResponseSchema,
    summary="Create food",
    description="Creates a food item with nutrition information that can later be used for food entry tracking.",
)
async def create_food(data: CreateFoodSchema):
    return await service.create_food(data)

@router.get(
    "/foods",
    response_model=list[FoodResponseSchema],
    summary="Search foods",
    description="Searches foods by name or brand using a case-insensitive partial match.",
)
async def search_foods(
    query: str = Query(..., min_length=1, max_length=100),
    limit: int = Query(20, ge=1, le=50),
    skip: int = Query(0, ge=0),
):
    return await service.search_foods(
        query=query,
        limit=limit,
        skip=skip
    )

@router.get(
    "/foods/{food_id}",
    response_model=FoodResponseSchema,
    summary="Get food by id",
    description="Returns a specific food item by its identifier.",
)
async def get_food(food_id: str):
    food = await service.get_food_by_id(food_id)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return food


@router.patch(
    "/foods/{food_id}",
    response_model=FoodResponseSchema,
    summary="Update food",
    description="Partially updates a food item's information and nutrition values.",
)
async def update_food(food_id: str, data: UpdateFoodSchema):
    food = await service.update_food(food_id, data)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return food