from datetime import datetime

import pytest
from pydantic import ValidationError

from app.schemas.food_schema import CreateFoodSchema, FoodResponseSchema, UpdateFoodSchema, FoodSearchQuerySchema

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

def test_create_food_strips_string_fields():
    food = CreateFoodSchema(
        name="  Chicken  ",
        brand="  Perutnina Ptuj  ",
        barcode=" 123 ",
    )

    assert food.name == "Chicken"
    assert food.brand == "Perutnina Ptuj"
    assert food.barcode == "123"

def test_create_food_accepts_nutrition_fields():
    food = CreateFoodSchema(
        name="Chicken breast",
        calories_per_100g=165,
        protein_g_per_100g=31,
        carbs_g_per_100g=0,
        fat_g_per_100g=3.6,
        fiber_g_per_100g=0,
        sugar_g_per_100g=0,
        salt_g_per_100g=0.2,
    )

    assert food.calories_per_100g == 165
    assert food.protein_g_per_100g == 31
    assert food.fat_g_per_100g == 3.6


def test_create_food_rejects_negative_nutrition_values():
    with pytest.raises(ValidationError):
        CreateFoodSchema(
            name="Broken food",
            calories_per_100g=-1,
        )


def test_update_food_rejects_negative_nutrition_values():
    with pytest.raises(ValidationError):
        UpdateFoodSchema(
            protein_g_per_100g=-5,
        )

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
        calories_per_100g=52,
        protein_g_per_100g=0.3,
        carbs_g_per_100g=14,
        fat_g_per_100g=0.2,
        fiber_g_per_100g=2.4,
        sugar_g_per_100g=10.4,
        salt_g_per_100g=0,
        source="manual",
        source_id=None,
        image_url=None,
        is_verified=False,
        created_at=now,
        updated_at=now
    )

    assert food.id == "123"
    assert food.source == "manual"

def test_food_search_query_valid():
    schema = FoodSearchQuerySchema(query="chicken")

    assert schema.query == "chicken"


def test_food_search_query_strips_whitespace():
    schema = FoodSearchQuerySchema(query="  chicken  ")

    assert schema.query == "chicken"


def test_food_search_query_rejects_empty_query():
    with pytest.raises(ValidationError):
        FoodSearchQuerySchema(query="")


def test_food_search_query_rejects_too_long_query():
    with pytest.raises(ValidationError):
        FoodSearchQuerySchema(query="a" * 101)