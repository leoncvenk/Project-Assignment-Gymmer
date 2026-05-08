import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager

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