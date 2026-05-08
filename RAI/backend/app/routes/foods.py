from fastapi import APIRouter

from app.services.food_service import FoodService
from app.repositories.food_repository import FoodRepository
from app.schemas.food_schema import CreateFoodSchema, UpdateFoodSchema, FoodResponseSchema

from app.core.database import get_db

router = APIRouter()

repo = FoodRepository()
service = FoodService(repo)

@router.get("/health/db")
async def db_health():
    db = get_db()
    await db.command("ping")
    return {"status": "ok"}

@router.post("/foods", response_model=FoodResponseSchema)
async def create_food(data: CreateFoodSchema):
    return await service.create_food(data)


@router.patch("/foods/{food_id}", response_model=FoodResponseSchema)
async def update_food(food_id: str, data: UpdateFoodSchema):
    return await service.update_food(food_id, data)


@router.get("/foods/{food_id}", response_model=FoodResponseSchema)
async def get_food(food_id: str):
    return await service.get_food_by_id(food_id)