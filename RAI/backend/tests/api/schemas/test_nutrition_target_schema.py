from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas.nutrition_target_schema import (
    CreateNutritionTargetSchema,
    NutritionTargetResponseSchema,
    UpdateNutritionTargetSchema,
)


def test_create_nutrition_target_valid():
    schema = CreateNutritionTargetSchema(
        calorie_target=2200,
        protein_target_g=180,
        carbs_target_g=220,
        fat_target_g=70,
    )

    assert schema.calorie_target == 2200
    assert schema.protein_target_g == 180
    assert schema.carbs_target_g == 220
    assert schema.fat_target_g == 70
    assert schema.source == "manual"


def test_create_nutrition_target_rejects_zero_calories():
    with pytest.raises(ValidationError):
        CreateNutritionTargetSchema(
            calorie_target=0,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        )


def test_create_nutrition_target_rejects_negative_macros():
    with pytest.raises(ValidationError):
        CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=-1,
            carbs_target_g=220,
            fat_target_g=70,
        )


def test_update_nutrition_target_partial_valid():
    schema = UpdateNutritionTargetSchema(
        protein_target_g=200,
    )

    assert schema.protein_target_g == 200
    assert schema.calorie_target is None


def test_update_nutrition_target_rejects_invalid_values():
    with pytest.raises(ValidationError):
        UpdateNutritionTargetSchema(
            fat_target_g=-5,
        )


def test_nutrition_target_response_schema_valid():
    now = datetime.now(timezone.utc)

    schema = NutritionTargetResponseSchema(
        id="target-123",
        user_id="user-123",

        calorie_target=2200,

        protein_target_g=180,
        carbs_target_g=220,
        fat_target_g=70,

        source="manual",

        created_at=now,
        updated_at=now,
    )

    assert schema.id == "target-123"
    assert schema.user_id == "user-123"

    assert schema.calorie_target == 2200

    assert schema.protein_target_g == 180
    assert schema.carbs_target_g == 220
    assert schema.fat_target_g == 70

    assert schema.source == "manual"