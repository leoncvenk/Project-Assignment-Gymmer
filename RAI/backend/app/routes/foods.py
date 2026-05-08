from fastapi import APIRouter, HTTPException

from app.schemas.food_schema import CreateFoodSchema, FoodResponseSchema, UpdateFoodSchema
from app.services.food_service import FoodService

router = APIRouter()
service = FoodService()


@router.post("/foods", response_model=FoodResponseSchema)
async def create_food(data: CreateFoodSchema):
    return await service.create_food(data)


@router.get("/foods/{food_id}", response_model=FoodResponseSchema)
async def get_food(food_id: str):
    food = await service.get_food_by_id(food_id)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return food


@router.patch("/foods/{food_id}", response_model=FoodResponseSchema)
async def update_food(food_id: str, data: UpdateFoodSchema):
    food = await service.update_food(food_id, data)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return food