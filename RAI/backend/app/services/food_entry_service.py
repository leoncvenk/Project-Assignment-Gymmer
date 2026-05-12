from dataclasses import asdict, replace
from datetime import date, datetime, time, timezone
from uuid import uuid4

from app.core.database import get_db
from app.models.food_entry import FoodEntry
from app.schemas.food_entry_schema import (
    CreateFoodEntrySchema,
    UpdateFoodEntrySchema,
)
from app.services.food_service import FOODS_COLLECTION

FOOD_ENTRIES_COLLECTION = "food_entries"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _entry_from_document(document: dict) -> FoodEntry:
    return FoodEntry(
        id=document["id"],
        user_id=document["user_id"],
        food_id=document["food_id"],
        quantity_g=document["quantity_g"],
        calories=document["calories"],
        protein_g=document["protein_g"],
        carbs_g=document["carbs_g"],
        fat_g=document["fat_g"],
        meal_type=document.get("meal_type", "unspecified"),
        consumed_at=document["consumed_at"],
        created_at=document.get("created_at"),
        updated_at=document.get("updated_at"),
    )


def _calculate_per_quantity(value_per_100g: float | None, quantity_g: float) -> float:
    if value_per_100g is None:
        return 0

    return round(value_per_100g * quantity_g / 100, 2)


class FoodEntryService:
    @property
    def collection(self):
        return get_db()[FOOD_ENTRIES_COLLECTION]

    @property
    def foods_collection(self):
        return get_db()[FOODS_COLLECTION]

    async def create_entry(
        self,
        user_id: str,
        data: CreateFoodEntrySchema,
    ) -> FoodEntry | None:
        food = await self.foods_collection.find_one({"id": data.food_id})

        if food is None:
            return None

        now = _now()
        consumed_at = data.consumed_at or now

        entry = FoodEntry(
            id=str(uuid4()),
            user_id=user_id,
            food_id=data.food_id,
            quantity_g=data.quantity_g,
            calories=_calculate_per_quantity(food.get("calories_per_100g"), data.quantity_g),
            protein_g=_calculate_per_quantity(food.get("protein_g_per_100g"), data.quantity_g),
            carbs_g=_calculate_per_quantity(food.get("carbs_g_per_100g"), data.quantity_g),
            fat_g=_calculate_per_quantity(food.get("fat_g_per_100g"), data.quantity_g),
            meal_type=data.meal_type,
            consumed_at=consumed_at,
            created_at=now,
            updated_at=now,
        )

        await self.collection.insert_one(asdict(entry))

        return entry
    
    async def update_entry(
        self,
        entry_id: str,
        user_id: str,
        data: UpdateFoodEntrySchema,
    ) -> FoodEntry | None:
        existing = await self.get_entry_by_id(
            entry_id=entry_id,
            user_id=user_id,
        )

        if existing is None:
            return None

        food = await self.foods_collection.find_one(
            {"id": existing.food_id}
        )

        if food is None:
            return None

        quantity_g = (
            data.quantity_g
            if data.quantity_g is not None
            else existing.quantity_g
        )

        calories = _calculate_per_quantity(
            food.get("calories_per_100g"),
            quantity_g,
        )

        protein_g = _calculate_per_quantity(
            food.get("protein_g_per_100g"),
            quantity_g,
        )

        carbs_g = _calculate_per_quantity(
            food.get("carbs_g_per_100g"),
            quantity_g,
        )

        fat_g = _calculate_per_quantity(
            food.get("fat_g_per_100g"),
            quantity_g,
        )

        updated = replace(
            existing,
            quantity_g=quantity_g,
            calories=calories,
            protein_g=protein_g,
            carbs_g=carbs_g,
            fat_g=fat_g,
            meal_type=(
                data.meal_type
                if data.meal_type is not None
                else existing.meal_type
            ),
            consumed_at=(
                data.consumed_at
                if data.consumed_at is not None
                else existing.consumed_at
            ),
            updated_at=_now(),
        )

        await self.collection.update_one(
            {"id": entry_id, "user_id": user_id},
            {"$set": asdict(updated)},
        )

        return updated

    async def get_entries_for_user(self, user_id: str) -> list[FoodEntry]:
        cursor = self.collection.find({"user_id": user_id}).sort("consumed_at", -1)

        documents = await cursor.to_list(length=None)

        return [_entry_from_document(document) for document in documents]
    
    async def get_entries_for_user_by_date(
        self,
        user_id: str,
        target_date: date,
    ) -> list[FoodEntry]:
        start_of_day = datetime.combine(
            target_date,
            time.min,
            tzinfo=timezone.utc,
        )

        end_of_day = datetime.combine(
            target_date,
            time.max,
            tzinfo=timezone.utc,
        )

        cursor = self.collection.find(
            {
                "user_id": user_id,
                "consumed_at": {
                    "$gte": start_of_day,
                    "$lte": end_of_day,
                },
            }
        ).sort("consumed_at", -1)

        documents = await cursor.to_list(length=None)

        return [_entry_from_document(document) for document in documents]

    async def get_entry_by_id(
        self,
        entry_id: str,
        user_id: str,
    ) -> FoodEntry | None:
        document = await self.collection.find_one(
            {
                "id": entry_id,
                "user_id": user_id,
            }
        )

        if document is None:
            return None

        return _entry_from_document(document)

    async def delete_entry(
        self,
        entry_id: str,
        user_id: str,
    ) -> bool:
        result = await self.collection.delete_one(
            {
                "id": entry_id,
                "user_id": user_id,
            }
        )

        return result.deleted_count == 1