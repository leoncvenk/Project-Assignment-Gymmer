from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas.food_entry_schema import CreateFoodEntrySchema, FoodEntryResponseSchema


def test_create_food_entry_valid():
    schema = CreateFoodEntrySchema(
        food_id="food-123",
        quantity_g=150,
    )

    assert schema.food_id == "food-123"
    assert schema.quantity_g == 150
    assert schema.consumed_at is None


def test_create_food_entry_accepts_consumed_at():
    now = datetime.now(timezone.utc)

    schema = CreateFoodEntrySchema(
        food_id="food-123",
        quantity_g=150,
        consumed_at=now,
    )

    assert schema.consumed_at == now


def test_create_food_entry_rejects_empty_food_id():
    with pytest.raises(ValidationError):
        CreateFoodEntrySchema(
            food_id="",
            quantity_g=150,
        )


def test_create_food_entry_rejects_zero_quantity():
    with pytest.raises(ValidationError):
        CreateFoodEntrySchema(
            food_id="food-123",
            quantity_g=0,
        )


def test_create_food_entry_rejects_negative_quantity():
    with pytest.raises(ValidationError):
        CreateFoodEntrySchema(
            food_id="food-123",
            quantity_g=-10,
        )


def test_food_entry_response_schema_valid():
    now = datetime.now(timezone.utc)

    schema = FoodEntryResponseSchema(
        id="entry-123",
        user_id="user-123",
        food_id="food-123",
        quantity_g=150,
        calories=247.5,
        protein_g=46.5,
        carbs_g=0,
        fat_g=5.4,
        meal_type="lunch",
        consumed_at=now,
        created_at=now,
        updated_at=now,
    )

    assert schema.id == "entry-123"
    assert schema.user_id == "user-123"
    assert schema.food_id == "food-123"
    assert schema.quantity_g == 150
    assert schema.calories == 247.5
    assert schema.protein_g == 46.5
    assert schema.carbs_g == 0
    assert schema.fat_g == 5.4


def test_food_entry_response_rejects_negative_nutrition():
    now = datetime.now(timezone.utc)

    with pytest.raises(ValidationError):
        FoodEntryResponseSchema(
            id="entry-123",
            user_id="user-123",
            food_id="food-123",
            quantity_g=150,
            calories=-1,
            protein_g=46.5,
            carbs_g=0,
            fat_g=5.4,
            consumed_at=now,
            created_at=now,
            updated_at=now,
        )

def test_create_food_entry_defaults_meal_type_to_unspecified():
    schema = CreateFoodEntrySchema(
        food_id="food-123",
        quantity_g=150,
    )

    assert schema.meal_type == "unspecified"


def test_create_food_entry_accepts_meal_type():
    schema = CreateFoodEntrySchema(
        food_id="food-123",
        quantity_g=150,
        meal_type="lunch",
    )

    assert schema.meal_type == "lunch"


def test_create_food_entry_rejects_invalid_meal_type():
    with pytest.raises(ValidationError):
        CreateFoodEntrySchema(
            food_id="food-123",
            quantity_g=150,
            meal_type="midnight_feast",
        )