from datetime import datetime

import pytest
from pydantic import ValidationError

from app.schemas.food_schema import CreateFoodSchema, FoodResponseSchema, UpdateFoodSchema

def test_create_food_valid():
    food = CreateFoodSchema(
        name="Chicken",
        brand="Perutnina Ptuj",
    )

    assert food.name == "Chicken"
    assert food.source == "manual"
    assert food.is_verified is False

def test_create_food_empty_name():
    with pytest.raises(ValidationError):
        CreateFoodSchema(name="")

def test_create_food_name_too_long():
    with pytest.raises(ValidationError):
        CreateFoodSchema(name="a" * 256)

def test_create_food_invalid_source():
    with pytest.raises(ValidationError):
        CreateFoodSchema(
            name="Rice",
            source="random_source"
        )

def test_create_food_optional_fields():
    food = CreateFoodSchema(name="Egg")

    assert food.brand is None
    assert food.barcode is None
    assert food.category is None

def test_update_food_no_fields():
    food = UpdateFoodSchema()

    assert food.brand is None

def test_update_food_empty_name_invalid():
    with pytest.raises(ValidationError):
        UpdateFoodSchema(name="")


def test_update_food_invalid_source():
    with pytest.raises(ValidationError):
        UpdateFoodSchema(source="random_source")

def test_update_food_partial_valid():
    food = UpdateFoodSchema(name="Rice")

    assert food.name == "Rice"
    assert food.brand is None
    assert food.source is None

def test_food_response_schema():
    now = datetime.now()

    food = FoodResponseSchema(
        id="123",
        name="Apple",
        brand=None,
        barcode=None,
        category=None,
        source="manual",
        source_id=None,
        image_url=None,
        is_verified=False,
        created_at=now,
        updated_at=now
    )

    assert food.id == "123"
    assert food.source == "manual"