from dataclasses import asdict
from datetime import datetime, timezone
from uuid import uuid4

from app.core.database import get_db
from app.models.food import Food
from app.schemas.food_schema import CreateFoodSchema, UpdateFoodSchema

UNKNOWN_BRAND = None
FOODS_COLLECTION = "foods"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _normalize_brand(brand: str | None) -> str | None:
    if brand is None or brand.strip() == "":
        return UNKNOWN_BRAND

    return brand.strip()


def _food_from_document(document: dict) -> Food:
    return Food(
        id=document["id"],
        name=document["name"],
        brand=document.get("brand"),
        barcode=document.get("barcode"),
        category=document.get("category"),

        calories_per_100g=document.get("calories_per_100g"),
        protein_g_per_100g=document.get("protein_g_per_100g"),
        carbs_g_per_100g=document.get("carbs_g_per_100g"),
        fat_g_per_100g=document.get("fat_g_per_100g"),
        fiber_g_per_100g=document.get("fiber_g_per_100g"),
        sugar_g_per_100g=document.get("sugar_g_per_100g"),
        salt_g_per_100g=document.get("salt_g_per_100g"),

        source=document.get("source", "manual"),
        source_id=document.get("source_id"),
        image_url=document.get("image_url"),
        is_verified=document.get("is_verified", False),
        created_at=document.get("created_at"),
        updated_at=document.get("updated_at"),
    )


class FoodService:
    @property
    def collection(self):
        return get_db()[FOODS_COLLECTION]

    async def create_food(self, data: CreateFoodSchema) -> Food:
        barcode = data.barcode.strip() if data.barcode else None

        if barcode:
            existing = await self.collection.find_one({"barcode": barcode})
            if existing:
                return _food_from_document(existing)

        now = _now()

        food = Food(
            id=str(uuid4()),
            name=data.name.strip(),
            brand=_normalize_brand(data.brand),
            barcode=barcode,
            category=data.category.strip() if data.category else None,

            calories_per_100g=data.calories_per_100g,
            protein_g_per_100g=data.protein_g_per_100g,
            carbs_g_per_100g=data.carbs_g_per_100g,
            fat_g_per_100g=data.fat_g_per_100g,
            fiber_g_per_100g=data.fiber_g_per_100g,
            sugar_g_per_100g=data.sugar_g_per_100g,
            salt_g_per_100g=data.salt_g_per_100g,

            source=data.source,
            source_id=data.source_id.strip() if data.source_id else None,
            image_url=data.image_url,
            is_verified=False,
            created_at=now,
            updated_at=now,
        )

        await self.collection.insert_one(asdict(food))

        return food

    async def update_food(self, food_id: str, data: UpdateFoodSchema) -> Food | None:
        existing = await self.collection.find_one({"id": food_id})

        if existing is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            if isinstance(value, str):
                update_data[key] = value.strip()

        if "brand" in update_data:
            update_data["brand"] = _normalize_brand(update_data["brand"])

        if update_data.get("barcode") == "":
            update_data["barcode"] = None

        if update_data.get("category") == "":
            update_data["category"] = None

        if update_data.get("source_id") == "":
            update_data["source_id"] = None

        # Users cannot verify food directly.
        update_data.pop("is_verified", None)

        update_data["updated_at"] = _now()

        await self.collection.update_one(
            {"id": food_id},
            {"$set": update_data},
        )

        updated = await self.collection.find_one({"id": food_id})

        return _food_from_document(updated)

    async def get_food_by_id(self, food_id: str) -> Food | None:
        document = await self.collection.find_one({"id": food_id})

        if document is None:
            return None

        return _food_from_document(document)

    async def get_food_by_barcode(self, barcode: str) -> Food | None:
        normalized_barcode = barcode.strip()

        document = await self.collection.find_one({"barcode": normalized_barcode})

        if document is None:
            return None

        return _food_from_document(document)

    async def request_verification(self, food_id: str, user_id: str) -> bool:
        food = await self.get_food_by_id(food_id)

        if food is None:
            return False

        return True
    
    async def search_foods(
        self,
        query: str,
    ) -> list[Food]:
        normalized_query = query.strip()

        cursor = self.collection.find(
            {
                "$or": [
                    {
                        "name": {
                            "$regex": normalized_query,
                            "$options": "i",
                        }
                    },
                    {
                        "brand": {
                            "$regex": normalized_query,
                            "$options": "i",
                        }
                    },
                ]
            }
        )

        documents = await cursor.to_list(length=50)

        return [
            _food_from_document(document)
            for document in documents
        ]