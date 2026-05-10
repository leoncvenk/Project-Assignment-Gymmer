from datetime import date, datetime, timezone

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager

from app.core.database import get_db
from app.main import app
from app.schemas.food_entry_schema import CreateFoodEntrySchema
from app.schemas.food_schema import CreateFoodSchema
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION, FoodEntryService
from app.services.food_service import FOODS_COLLECTION, FoodService
from app.services.nutrition_summary_service import NutritionSummaryService


@pytest_asyncio.fixture
async def services():
    async with LifespanManager(app):
        db = get_db()

        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})

        yield FoodService(), FoodEntryService(), NutritionSummaryService()

        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})


@pytest.mark.asyncio
async def test_get_daily_summary_returns_zero_for_empty_day(services):
    _, _, summary_service = services

    summary = await summary_service.get_daily_summary(
        user_id="user-123",
        summary_date=date(2025, 5, 10),
    )

    assert summary.date == date(2025, 5, 10)
    assert summary.total_calories == 0
    assert summary.total_protein_g == 0
    assert summary.total_carbs_g == 0
    assert summary.total_fat_g == 0
    assert summary.entry_count == 0


@pytest.mark.asyncio
async def test_get_daily_summary_sums_user_entries_for_date(services):
    food_service, entry_service, summary_service = services

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            calories_per_100g=165,
            protein_g_per_100g=31,
            carbs_g_per_100g=0,
            fat_g_per_100g=3.6,
        )
    )

    await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            consumed_at=datetime(2026, 5, 10, 8, 0, tzinfo=timezone.utc),
        ),
    )

    await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=200,
            consumed_at=datetime(2026, 5, 10, 18, 0, tzinfo=timezone.utc),
        ),
    )

    summary = await summary_service.get_daily_summary(
        user_id="user-123",
        summary_date=date(2026, 5, 10),
    )

    assert summary.total_calories == 495
    assert summary.total_protein_g == 93
    assert summary.total_carbs_g == 0
    assert summary.total_fat_g == 10.8
    assert summary.entry_count == 2


@pytest.mark.asyncio
async def test_get_daily_summary_ignores_other_users_entries(services):
    food_service, entry_service, summary_service = services

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Rice",
            calories_per_100g=130,
            protein_g_per_100g=2.7,
            carbs_g_per_100g=28,
            fat_g_per_100g=0.3,
        )
    )

    await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            consumed_at=datetime(2026, 5, 10, 12, 0, tzinfo=timezone.utc),
        ),
    )

    await entry_service.create_entry(
        user_id="other-user",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=300,
            consumed_at=datetime(2026, 5, 10, 12, 0, tzinfo=timezone.utc),
        ),
    )

    summary = await summary_service.get_daily_summary(
        user_id="user-123",
        summary_date=date(2026, 5, 10),
    )

    assert summary.total_calories == 130
    assert summary.total_protein_g == 2.7
    assert summary.total_carbs_g == 28
    assert summary.total_fat_g == 0.3
    assert summary.entry_count == 1


@pytest.mark.asyncio
async def test_get_daily_summary_ignores_other_dates(services):
    food_service, entry_service, summary_service = services

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Banana",
            calories_per_100g=89,
            protein_g_per_100g=1.1,
            carbs_g_per_100g=22.8,
            fat_g_per_100g=0.3,
        )
    )

    await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            consumed_at=datetime(2026, 5, 9, 12, 0, tzinfo=timezone.utc),
        ),
    )

    await entry_service.create_entry(
        user_id="user-123",
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            consumed_at=datetime(2026, 5, 10, 12, 0, tzinfo=timezone.utc),
        ),
    )

    summary = await summary_service.get_daily_summary(
        user_id="user-123",
        summary_date=date(2026, 5, 10),
    )

    assert summary.total_calories == 89
    assert summary.total_protein_g == 1.1
    assert summary.total_carbs_g == 22.8
    assert summary.total_fat_g == 0.3
    assert summary.entry_count == 1