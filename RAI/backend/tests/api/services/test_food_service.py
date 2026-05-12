from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from unittest.mock import AsyncMock

from app.core.database import get_db
from app.main import app
from app.schemas.food_schema import CreateFoodSchema, UpdateFoodSchema
from app.services.food_service import FOODS_COLLECTION, FoodService, UNKNOWN_BRAND

def assert_same_food(actual, expected):
    assert actual is not None
    assert actual.id == expected.id
    assert actual.name == expected.name
    assert actual.brand == expected.brand
    assert actual.barcode == expected.barcode
    assert actual.category == expected.category
    assert actual.calories_per_100g == expected.calories_per_100g
    assert actual.protein_g_per_100g == expected.protein_g_per_100g
    assert actual.carbs_g_per_100g == expected.carbs_g_per_100g
    assert actual.fat_g_per_100g == expected.fat_g_per_100g
    assert actual.fiber_g_per_100g == expected.fiber_g_per_100g
    assert actual.sugar_g_per_100g == expected.sugar_g_per_100g
    assert actual.salt_g_per_100g == expected.salt_g_per_100g
    assert actual.source == expected.source
    assert actual.source_id == expected.source_id
    assert actual.image_url == expected.image_url
    assert actual.is_verified == expected.is_verified

@pytest_asyncio.fixture
async def service():
    async with LifespanManager(app):
        db = get_db()
        await db[FOODS_COLLECTION].delete_many({})

        yield FoodService()

        await db[FOODS_COLLECTION].delete_many({})


@pytest.mark.asyncio
async def test_create_food_stores_food(service):
    food = await service.create_food(CreateFoodSchema(name="Chicken"))

    result = await service.get_food_by_id(food.id)

    assert_same_food(result, food)


@pytest.mark.asyncio
async def test_create_food_normalizes_name_and_brand(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="  Chicken  ",
            brand="  Perutnina Ptuj  ",
        )
    )

    assert food.name == "Chicken"
    assert food.brand == "Perutnina Ptuj"


@pytest.mark.asyncio
async def test_create_food_missing_brand_becomes_unknown(service):
    food = await service.create_food(CreateFoodSchema(name="Rice"))

    assert food.brand == UNKNOWN_BRAND


@pytest.mark.asyncio
async def test_create_food_empty_brand_becomes_unknown(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="Rice",
            brand="   ",
        )
    )

    assert food.brand == UNKNOWN_BRAND


@pytest.mark.asyncio
async def test_create_food_user_cannot_set_verified_true(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="Protein bar",
            is_verified=True,
        )
    )

    assert food.is_verified is False


@pytest.mark.asyncio
async def test_create_food_with_barcode_can_be_found_by_barcode(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="Milk",
            barcode=" 123456 ",
        )
    )

    result = await service.get_food_by_barcode("123456")

    assert food.barcode == "123456"
    assert_same_food(result, food)


@pytest.mark.asyncio
async def test_create_food_duplicate_barcode_returns_existing_food(service):
    first = await service.create_food(
        CreateFoodSchema(
            name="Milk",
            barcode="123456",
        )
    )

    second = await service.create_food(
        CreateFoodSchema(
            name="Different Milk",
            barcode="123456",
        )
    )

    assert_same_food(second, first)


@pytest.mark.asyncio
async def test_get_food_by_id_existing_food(service):
    food = await service.create_food(CreateFoodSchema(name="Apple"))

    result = await service.get_food_by_id(food.id)

    assert_same_food(result, food)


@pytest.mark.asyncio
async def test_get_food_by_id_missing_food_returns_none(service):
    result = await service.get_food_by_id("missing-id")

    assert result is None


@pytest.mark.asyncio
async def test_get_food_by_barcode_existing_food(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="Banana",
            barcode="987654",
        )
    )

    result = await service.get_food_by_barcode("987654")

    assert_same_food(result, food)


@pytest.mark.asyncio
async def test_get_food_by_barcode_strips_input(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="Banana",
            barcode="987654",
        )
    )

    result = await service.get_food_by_barcode(" 987654 ")

    assert_same_food(result, food)


@pytest.mark.asyncio
async def test_update_food_partial(service):
    food = await service.create_food(CreateFoodSchema(name="Apple"))

    updated = await service.update_food(
        food.id,
        UpdateFoodSchema(name="Green Apple"),
    )

    assert updated is not None
    assert updated.name == "Green Apple"
    assert updated.id == food.id


@pytest.mark.asyncio
async def test_request_verification_existing_food_returns_true(service):
    food = await service.create_food(CreateFoodSchema(name="Apple"))

    result = await service.request_verification(food.id, user_id="user-123")

    assert result is True


@pytest.mark.asyncio
async def test_request_verification_missing_food_returns_false(service):
    result = await service.request_verification("missing-id", user_id="user-123")

    assert result is False

@pytest.mark.asyncio
async def test_create_food_stores_nutrition_fields(service):
    food = await service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            calories_per_100g=165,
            protein_g_per_100g=31,
            carbs_g_per_100g=0,
            fat_g_per_100g=3.6,
            fiber_g_per_100g=0,
            sugar_g_per_100g=0,
            salt_g_per_100g=0.2,
        )
    )

    result = await service.get_food_by_id(food.id)

    assert result is not None
    assert result.calories_per_100g == 165
    assert result.protein_g_per_100g == 31
    assert result.carbs_g_per_100g == 0
    assert result.fat_g_per_100g == 3.6
    assert result.salt_g_per_100g == 0.2


@pytest.mark.asyncio
async def test_update_food_updates_nutrition_fields(service):
    food = await service.create_food(CreateFoodSchema(name="Rice"))

    updated = await service.update_food(
        food.id,
        UpdateFoodSchema(
            calories_per_100g=130,
            carbs_g_per_100g=28,
            protein_g_per_100g=2.7,
            fat_g_per_100g=0.3,
        ),
    )

    assert updated is not None
    assert updated.calories_per_100g == 130
    assert updated.carbs_g_per_100g == 28
    assert updated.protein_g_per_100g == 2.7
    assert updated.fat_g_per_100g == 0.3

@pytest.mark.asyncio
async def test_search_foods_by_name_partial_match(service):
    chicken = await service.create_food(
        CreateFoodSchema(name="Chicken breast")
    )

    await service.create_food(
        CreateFoodSchema(name="Rice")
    )

    results = await service.search_foods("chick")

    assert len(results) == 1
    assert results[0].id == chicken.id


@pytest.mark.asyncio
async def test_search_foods_by_brand_partial_match(service):
    chicken = await service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            brand="Perutnina Ptuj",
        )
    )

    await service.create_food(
        CreateFoodSchema(
            name="Greek yogurt",
            brand="Dukat",
        )
    )

    results = await service.search_foods("perutnina")

    assert len(results) == 1
    assert results[0].id == chicken.id


@pytest.mark.asyncio
async def test_search_foods_is_case_insensitive(service):
    food = await service.create_food(
        CreateFoodSchema(name="Chicken breast")
    )

    results = await service.search_foods("CHICKEN")

    assert len(results) == 1
    assert results[0].id == food.id


@pytest.mark.asyncio
async def test_search_foods_returns_empty_list_when_no_match(service):
    await service.create_food(
        CreateFoodSchema(name="Chicken breast")
    )

    results = await service.search_foods("banana")

    assert results == []

@pytest.mark.asyncio
async def test_search_foods_respects_limit(service):
    unique = uuid4().hex[:8]

    for index in range(3):
        await service.create_food(
            CreateFoodSchema(
                name=f"SearchChickenLimit-{unique}-{index}"
            )
        )

    results = await service.search_foods(
        query=f"SearchChickenLimit-{unique}",
        limit=2,
    )

    assert len(results) == 2


@pytest.mark.asyncio
async def test_search_foods_respects_skip(service):
    unique = uuid4().hex[:8]

    await service.create_food(
        CreateFoodSchema(
            name=f"SearchChickenSkip-{unique}-1"
        )
    )

    await service.create_food(
        CreateFoodSchema(
            name=f"SearchChickenSkip-{unique}-2"
        )
    )

    results_without_skip = await service.search_foods(
        query=f"SearchChickenSkip-{unique}",
        limit=10,
        skip=0,
    )

    results_with_skip = await service.search_foods(
        query=f"SearchChickenSkip-{unique}",
        limit=10,
        skip=1,
    )

    assert len(results_without_skip) == 2
    assert len(results_with_skip) == 1
    
@pytest.mark.asyncio
async def test_import_food_by_barcode_returns_existing_food(service):
    existing = await service.create_food(
        CreateFoodSchema(
            name="Milk",
            barcode="123456",
        )
    )

    result = await service.import_food_by_barcode("123456")

    assert_same_food(result, existing)

@pytest.mark.asyncio
async def test_import_food_by_barcode_creates_food_from_open_food_facts(service):
    service.open_food_facts_service.get_product_by_barcode = AsyncMock(
        return_value={
            "product_name": "Protein bar",
            "brands": "Test Brand",
            "categories": "Snacks",
            "image_front_url": "https://example.com/image.jpg",
            "nutriments": {
                "energy-kcal_100g": 350,
                "proteins_100g": 30,
                "carbohydrates_100g": 40,
                "fat_100g": 10,
                "fiber_100g": 5,
                "sugars_100g": 12,
                "salt_100g": 0.4,
            },
        }
    )

    result = await service.import_food_by_barcode("987654")

    assert result is not None
    assert result.name == "Protein bar"
    assert result.brand == "Test Brand"
    assert result.barcode == "987654"
    assert result.category == "Snacks"
    assert result.image_url == "https://example.com/image.jpg"

    assert result.calories_per_100g == 350
    assert result.protein_g_per_100g == 30
    assert result.carbs_g_per_100g == 40
    assert result.fat_g_per_100g == 10
    assert result.fiber_g_per_100g == 5
    assert result.sugar_g_per_100g == 12
    assert result.salt_g_per_100g == 0.4

    assert result.source == "open_food_facts"
    assert result.source_id == "987654"

@pytest.mark.asyncio
async def test_import_food_by_barcode_returns_none_when_open_food_facts_missing(service):
    service.open_food_facts_service.get_product_by_barcode = AsyncMock(
        return_value=None
    )

    result = await service.import_food_by_barcode("missing-barcode")

    assert result is None

@pytest.mark.asyncio
async def test_import_food_by_barcode_returns_none_when_product_has_no_name(service):
    service.open_food_facts_service.get_product_by_barcode = AsyncMock(
        return_value={
            "brands": "Test Brand",
            "nutriments": {},
        }
    )

    result = await service.import_food_by_barcode("987654")

    assert result is None