from dataclasses import replace
from datetime import datetime, timezone
from uuid import uuid4

from app.models.food import Food
from app.schemas.food_schema import CreateFoodSchema, UpdateFoodSchema
from app.repositories.food_repository import FoodRepository

UNKNOWN_BRAND = None


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _normalize_brand(brand: str | None) -> str:
    if brand is None or brand.strip() == "":
        return UNKNOWN_BRAND

    return brand.strip()


class FoodService:
    def __init__(self, repo: FoodRepository):
        self.repo = repo

    async def create_food(self, data: CreateFoodSchema) -> Food:
        if data.barcode:
            existing = await self.repo.get_by_barcode(data.barcode.strip())
            if existing:
                return existing

        now = _now()

        food = Food(
            id=str(uuid4()),
            name=data.name.strip(),
            brand=_normalize_brand(data.brand),
            barcode=data.barcode.strip() if data.barcode else None,
            category=data.category.strip() if data.category else None,
            source=data.source,
            source_id=data.source_id.strip() if data.source_id else None,
            image_url=data.image_url,
            is_verified=False,
            created_at=now,
            updated_at=now,
        )

        return await self.repo.create(food)

    async def update_food(self, food_id: str, data: UpdateFoodSchema):
        food = await self.repo.get_by_id(food_id)

        if food is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        if "barcode" in update_data and update_data["barcode"]:
            update_data["barcode"] = update_data["barcode"].strip()

        for key, value in update_data.items():
            if isinstance(value, str):
                update_data[key] = value.strip()

        updated_food = replace(
            food,
            **update_data,
            updated_at=_now(),
        )

        return await self.repo.update(updated_food)

    async def get_food_by_id(self, food_id: str) -> Food | None:
        return await self.repo.get_by_id(food_id)

    async def get_food_by_barcode(self, barcode: str) -> Food | None:
        return await self.repo.get_by_barcode(barcode.strip())

    async def request_verification(self, food_id: str, user_id: str) -> bool:
        food = await self.repo.get_by_id(food_id)

        if food is None:
            return False

        return True