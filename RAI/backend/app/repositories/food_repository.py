from bson import ObjectId
from app.core.database import get_db
from app.models.food import Food


class FoodRepository:

    def _collection(self):
        return get_db()["foods"]

    async def get_by_id(self, food_id: str):
        doc = await self._collection().find_one({"_id": ObjectId(food_id)})
        return self._to_model(doc) if doc else None

    async def get_by_barcode(self, barcode: str):
        doc = await self._collection().find_one({"barcode": barcode.strip()})
        return self._to_model(doc) if doc else None

    async def create(self, food: Food):
        doc = self._to_document(food)
        doc.pop("_id", None)

        result = await collection.insert_one(doc)

        return self._to_model({
            **doc,
            "_id": result.inserted_id
        })

    async def update(self, food: Food):
        doc = self._to_document(food)
        await self._collection().update_one(
            {"_id": ObjectId(food.id)},
            {"$set": doc}
        )
        return food

    def _to_model(self, doc) -> Food:
        return Food(
            id=str(doc["_id"]),
            name=doc["name"],
            brand=doc.get("brand"),
            barcode=doc.get("barcode"),
            category=doc.get("category"),
            source=doc.get("source"),
            source_id=doc.get("source_id"),
            image_url=doc.get("image_url"),
            is_verified=doc.get("is_verified", False),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
        )

    def _to_document(self, food: Food) -> dict:
        return {
            "name": food.name,
            "brand": food.brand,
            "barcode": food.barcode,
            "category": food.category,
            "source": food.source,
            "source_id": food.source_id,
            "image_url": food.image_url,
            "is_verified": food.is_verified,
            "created_at": food.created_at,
            "updated_at": food.updated_at,
        }