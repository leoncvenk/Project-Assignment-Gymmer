from dataclasses import asdict
from datetime import datetime, timezone
from uuid import uuid4

from app.core.database import get_db
from app.models.nutrition_target import NutritionTarget
from app.schemas.nutrition_target_schema import (
    CreateNutritionTargetSchema,
    UpdateNutritionTargetSchema,
)

NUTRITION_TARGETS_COLLECTION = "nutrition_targets"


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _nutrition_target_from_document(
    document: dict,
) -> NutritionTarget:
    return NutritionTarget(
        id=document["id"],
        user_id=document["user_id"],

        calorie_target=document["calorie_target"],

        protein_target_g=document["protein_target_g"],
        carbs_target_g=document["carbs_target_g"],
        fat_target_g=document["fat_target_g"],

        source=document.get("source", "manual"),

        created_at=document.get("created_at"),
        updated_at=document.get("updated_at"),
    )


class NutritionTargetService:
    @property
    def collection(self):
        return get_db()[NUTRITION_TARGETS_COLLECTION]

    async def create_or_replace_target(
        self,
        user_id: str,
        data: CreateNutritionTargetSchema,
    ) -> NutritionTarget:
        existing = await self.collection.find_one(
            {"user_id": user_id}
        )

        now = _now()

        target = NutritionTarget(
            id=existing["id"] if existing else str(uuid4()),
            user_id=user_id,

            calorie_target=data.calorie_target,

            protein_target_g=data.protein_target_g,
            carbs_target_g=data.carbs_target_g,
            fat_target_g=data.fat_target_g,

            source=data.source,

            created_at=(
                existing.get("created_at")
                if existing
                else now
            ),
            updated_at=now,
        )

        await self.collection.replace_one(
            {"user_id": user_id},
            asdict(target),
            upsert=True,
        )

        return target

    async def get_target_by_user_id(
        self,
        user_id: str,
    ) -> NutritionTarget | None:
        document = await self.collection.find_one(
            {"user_id": user_id}
        )

        if document is None:
            return None

        return _nutrition_target_from_document(document)

    async def update_target(
        self,
        user_id: str,
        data: UpdateNutritionTargetSchema,
    ) -> NutritionTarget | None:
        existing = await self.collection.find_one(
            {"user_id": user_id}
        )

        if existing is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        update_data["updated_at"] = _now()

        await self.collection.update_one(
            {"user_id": user_id},
            {"$set": update_data},
        )

        updated = await self.collection.find_one(
            {"user_id": user_id}
        )

        return _nutrition_target_from_document(updated)