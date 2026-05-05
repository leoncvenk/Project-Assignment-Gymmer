from fastapi import APIRouter, HTTPException

from app.schemas.food_schema import CreateFoodSchema, FoodResponseSchema, UpdateFoodSchema
from app.services.food_service import FoodService

router = APIRouter()
service = FoodService()

@router.post("/foods", response_model=FoodResponseSchema)
def create_food(data: CreateFoodSchema):
    food = service.create_food(data)
    return food

@router.get("/foods/{food_id}", response_model=FoodResponseSchema)
def get_food(food_id: str):
    food = service.get_food_by_id(food_id)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    
    return food

@router.get("/foods/barcode/{barcode}", response_model=FoodResponseSchema)
def get_food_by_barcode(barcode: str):
    food = service.get_food_by_barcode(barcode)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return food

@router.patch("/foods/{food_id}", response_model=FoodResponseSchema)
def update_food(food_id: str, data: UpdateFoodSchema):
    food = service.update_food(food_id, data)

    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return food