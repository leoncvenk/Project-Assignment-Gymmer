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

ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}


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

def _calculate_bmr(
    weight_kg: float,
    height_cm: float,
    age: int,
    sex: str,
) -> float:
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age

    if sex == "male":
        return base + 5

    return base - 161


def _adjust_calories_for_goal(
    maintenance_calories: float,
    goal_type: str,
) -> int:
    if goal_type == "lose_weight":
        return round(maintenance_calories - 400)

    if goal_type == "gain_weight":
        return round(maintenance_calories + 300)

    return round(maintenance_calories)


def _calculate_macros(
    calorie_target: int,
    weight_kg: float,
) -> tuple[float, float, float]:
    protein_target_g = round(weight_kg * 2.0, 1)
    fat_target_g = round(weight_kg * 0.8, 1)

    protein_calories = protein_target_g * 4
    fat_calories = fat_target_g * 9

    remaining_calories = max(
        calorie_target - protein_calories - fat_calories,
        0,
    )

    carbs_target_g = round(remaining_calories / 4, 1)

    return protein_target_g, carbs_target_g, fat_target_g


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
    
    async def create_from_profile(
        self,
        user_id: str,
        profile,
    ) -> NutritionTarget:
        activity_multiplier = ACTIVITY_MULTIPLIERS[profile.activity_level]

        bmr = _calculate_bmr(
            weight_kg=profile.weight_kg,
            height_cm=profile.height_cm,
            age=profile.age,
            sex=profile.sex,
        )

        maintenance_calories = bmr * activity_multiplier

        calorie_target = _adjust_calories_for_goal(
            maintenance_calories=maintenance_calories,
            goal_type=profile.goal_type,
        )

        protein_target_g, carbs_target_g, fat_target_g = _calculate_macros(
            calorie_target=calorie_target,
            weight_kg=profile.weight_kg,
        )

        return await self.create_or_replace_target(
            user_id=user_id,
            data=CreateNutritionTargetSchema(
                calorie_target=calorie_target,
                protein_target_g=protein_target_g,
                carbs_target_g=carbs_target_g,
                fat_target_g=fat_target_g,
                source="profile_estimate",
            ),
        )

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