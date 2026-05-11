import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager

from app.core.database import get_db
from app.main import app
from app.schemas.food_entry_schema import CreateFoodEntrySchema
from app.schemas.food_schema import CreateFoodSchema
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION, FoodEntryService
from app.services.food_service import FOODS_COLLECTION, FoodService


def assert_same_entry(actual, expected):
    assert actual is not None
    assert actual.id == expected.id
    assert actual.user_id == expected.user_id
    assert actual.food_id == expected.food_id
    assert actual.quantity_g == expected.quantity_g
    assert actual.calories == expected.calories
    assert actual.protein_g == expected.protein_g
    assert actual.carbs_g == expected.carbs_g
    assert actual.fat_g == expected.fat_g
    assert actual.meal_type == expected.meal_type

    assert actual.consumed_at is not None
    assert actual.created_at is not None
    assert actual.updated_at is not None


@pytest_asyncio.fixture
async def services():
    async with LifespanManager(app):
        db = get_db()

        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})

        yield FoodService(), FoodEntryService()

        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})


@pytest.mark.asyncio
async def test_create_entry_calculates_nutrition_from_food(services):
    food_service, entry_service = services

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            calories_per_100g=165,
            protein_g_per_100g=31,
            carbs_g_per_100g=0,
            fat_g_per_100g=3.6,
        )
    )

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=150,
        ),
    )

    assert entry is not None
    assert entry.user_id == "user-123"
    assert entry.food_id == food.id
    assert entry.quantity_g == 150

    assert entry.calories == 247.5
    assert entry.protein_g == 46.5
    assert entry.carbs_g == 0
    assert entry.fat_g == 5.4


@pytest.mark.asyncio
async def test_create_entry_uses_zero_for_missing_nutrition_values(services):
    food_service, entry_service = services

    food = await food_service.create_food(
        CreateFoodSchema(name="Unknown food")
    )

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
        ),
    )

    assert entry is not None
    assert entry.calories == 0
    assert entry.protein_g == 0
    assert entry.carbs_g == 0
    assert entry.fat_g == 0


@pytest.mark.asyncio
async def test_create_entry_missing_food_returns_none(services):
    _, entry_service = services

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id="missing-food",
            quantity_g=100,
        ),
    )

    assert entry is None


@pytest.mark.asyncio
async def test_get_entries_for_user_returns_only_user_entries(services):
    food_service, entry_service = services

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Rice",
            calories_per_100g=130,
            protein_g_per_100g=2.7,
            carbs_g_per_100g=28,
            fat_g_per_100g=0.3,
        )
    )

    user_entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(food_id=food.id, quantity_g=100),
    )

    await entry_service.create_entry(
        user_id="other-user",
        data=CreateFoodEntrySchema(food_id=food.id, quantity_g=100),
    )

    entries = await entry_service.get_entries_for_user("user-123")

    assert len(entries) == 1
    assert_same_entry(entries[0], user_entry)


@pytest.mark.asyncio
async def test_get_entry_by_id_returns_user_owned_entry(services):
    food_service, entry_service = services

    food = await food_service.create_food(CreateFoodSchema(name="Apple"))

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(food_id=food.id, quantity_g=100),
    )

    result = await entry_service.get_entry_by_id(
        entry_id=entry.id,
        user_id="user-123",
    )

    assert_same_entry(result, entry)


@pytest.mark.asyncio
async def test_get_entry_by_id_does_not_return_other_users_entry(services):
    food_service, entry_service = services

    food = await food_service.create_food(CreateFoodSchema(name="Apple"))

    entry = await entry_service.create_entry(
        user_id="other-user",
        data=CreateFoodEntrySchema(food_id=food.id, quantity_g=100),
    )

    result = await entry_service.get_entry_by_id(
        entry_id=entry.id,
        user_id="user-123",
    )

    assert result is None


@pytest.mark.asyncio
async def test_delete_entry_removes_user_owned_entry(services):
    food_service, entry_service = services

    food = await food_service.create_food(CreateFoodSchema(name="Apple"))

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(food_id=food.id, quantity_g=100),
    )

    deleted = await entry_service.delete_entry(
        entry_id=entry.id,
        user_id="user-123",
    )

    result = await entry_service.get_entry_by_id(
        entry_id=entry.id,
        user_id="user-123",
    )

    assert deleted is True
    assert result is None


@pytest.mark.asyncio
async def test_delete_entry_does_not_remove_other_users_entry(services):
    food_service, entry_service = services

    food = await food_service.create_food(CreateFoodSchema(name="Apple"))

    entry = await entry_service.create_entry(
        user_id="other-user",
        data=CreateFoodEntrySchema(food_id=food.id, quantity_g=100),
    )

    deleted = await entry_service.delete_entry(
        entry_id=entry.id,
        user_id="user-123",
    )

    result = await entry_service.get_entry_by_id(
        entry_id=entry.id,
        user_id="other-user",
    )

    assert deleted is False
    assert result is not None

@pytest.mark.asyncio
async def test_create_entry_defaults_meal_type_to_unspecified(services):
    food_service, entry_service = services

    food = await food_service.create_food(
        CreateFoodSchema(name="Apple")
    )

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
        ),
    )

    assert entry is not None
    assert entry.meal_type == "unspecified"


@pytest.mark.asyncio
async def test_create_entry_stores_meal_type(services):
    food_service, entry_service = services

    food = await food_service.create_food(
        CreateFoodSchema(name="Rice")
    )

    entry = await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            meal_type="lunch",
        ),
    )

    result = await entry_service.get_entry_by_id(
        entry_id=entry.id,
        user_id="user-123",
    )

    assert result is not None
    assert result.meal_type == "lunch"