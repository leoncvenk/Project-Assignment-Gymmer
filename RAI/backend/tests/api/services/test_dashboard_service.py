from datetime import date, datetime, timezone
from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager

from app.core.database import get_db
from app.main import app
from app.schemas.food_entry_schema import CreateFoodEntrySchema
from app.schemas.food_schema import CreateFoodSchema
from app.schemas.nutrition_target_schema import CreateNutritionTargetSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.dashboard_service import DashboardService
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION, FoodEntryService
from app.services.food_service import FOODS_COLLECTION, FoodService
from app.services.nutrition_target_service import (
    NUTRITION_TARGETS_COLLECTION,
    NutritionTargetService,
)
from app.services.user_service import USERS_COLLECTION, UserService


def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"


@pytest_asyncio.fixture
async def services():
    async with LifespanManager(app):
        db = get_db()

        await db[USERS_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})
        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})

        yield (
            UserService(),
            FoodService(),
            FoodEntryService(),
            NutritionTargetService(),
            DashboardService(),
        )

        await db[USERS_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})
        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})


async def create_user(user_service: UserService):
    return await user_service.create_user(
        CreateUserSchema(
            username=f"user-{uuid4().hex[:8]}",
            email=unique_email(),
            password="Password123!",
        )
    )


@pytest.mark.asyncio
async def test_get_dashboard_without_target_returns_empty_target_state(services):
    (
        user_service,
        _,
        _,
        _,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    dashboard = await dashboard_service.get_dashboard(
        user_id=user.id,
        dashboard_date=date(2026, 5, 10),
    )

    assert dashboard.date == date(2026, 5, 10)
    assert dashboard.profile_completed is False
    assert dashboard.has_nutrition_target is False

    assert dashboard.summary.total_calories == 0
    assert dashboard.summary.total_protein_g == 0
    assert dashboard.summary.total_carbs_g == 0
    assert dashboard.summary.total_fat_g == 0
    assert dashboard.summary.entry_count == 0

    assert dashboard.targets is None
    assert dashboard.remaining is None
    assert dashboard.progress is None
    assert dashboard.entries == []


@pytest.mark.asyncio
async def test_get_dashboard_with_target_returns_remaining_and_progress(services):
    (
        user_service,
        food_service,
        entry_service,
        target_service,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            calories_per_100g=165,
            protein_g_per_100g=31,
            carbs_g_per_100g=0,
            fat_g_per_100g=3.6,
        )
    )

    await target_service.create_or_replace_target(
        user_id=user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            meal_type="breakfast",
            consumed_at=datetime(2026, 5, 10, 8, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_dashboard(
        user_id=user.id,
        dashboard_date=date(2026, 5, 10),
    )

    assert dashboard.has_nutrition_target is True

    assert dashboard.summary.total_calories == 165
    assert dashboard.summary.total_protein_g == 31
    assert dashboard.summary.total_carbs_g == 0
    assert dashboard.summary.total_fat_g == 3.6
    assert dashboard.summary.entry_count == 1

    assert dashboard.targets is not None
    assert dashboard.targets.calorie_target == 2200
    assert dashboard.targets.protein_target_g == 180

    assert dashboard.remaining is not None
    assert dashboard.remaining.calories == 2035
    assert dashboard.remaining.protein_g == 149
    assert dashboard.remaining.carbs_g == 220
    assert dashboard.remaining.fat_g == 66.4

    assert dashboard.progress is not None
    assert dashboard.progress.calories_percent == 7.5
    assert dashboard.progress.protein_percent == 17.22
    assert dashboard.progress.carbs_percent == 0
    assert dashboard.progress.fat_percent == 5.14

    assert len(dashboard.entries) == 1
    assert dashboard.entries[0].food_id == food.id
    assert dashboard.entries[0].meal_type == "breakfast"


@pytest.mark.asyncio
async def test_get_dashboard_ignores_entries_from_other_dates(services):
    (
        user_service,
        food_service,
        entry_service,
        target_service,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Banana",
            calories_per_100g=89,
            protein_g_per_100g=1.1,
            carbs_g_per_100g=22.8,
            fat_g_per_100g=0.3,
        )
    )

    await target_service.create_or_replace_target(
        user_id=user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=2000,
            protein_target_g=150,
            carbs_target_g=250,
            fat_target_g=60,
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            meal_type="breakfast",
            consumed_at=datetime(2026, 5, 9, 12, 0, tzinfo=timezone.utc),
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            meal_type="dinner",
            consumed_at=datetime(2026, 5, 10, 12, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_dashboard(
        user_id=user.id,
        dashboard_date=date(2026, 5, 10),
    )

    assert dashboard.summary.total_calories == 89
    assert dashboard.summary.entry_count == 1
    assert len(dashboard.entries) == 1
    assert dashboard.entries[0].meal_type == "dinner"


@pytest.mark.asyncio
async def test_get_dashboard_ignores_other_users_entries_and_targets(services):
    (
        user_service,
        food_service,
        entry_service,
        target_service,
        dashboard_service,
    ) = services

    user = await create_user(user_service)
    other_user = await create_user(user_service)

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Rice",
            calories_per_100g=130,
            protein_g_per_100g=2.7,
            carbs_g_per_100g=28,
            fat_g_per_100g=0.3,
        )
    )

    await target_service.create_or_replace_target(
        user_id=user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    await target_service.create_or_replace_target(
        user_id=other_user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=3000,
            protein_target_g=250,
            carbs_target_g=350,
            fat_target_g=100,
        ),
    )

    await entry_service.create_entry(
        user_id=other_user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=300,
            meal_type="breakfast",
            consumed_at=datetime(2026, 5, 10, 12, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_dashboard(
        user_id=user.id,
        dashboard_date=date(2026, 5, 10),
    )

    assert dashboard.summary.total_calories == 0
    assert dashboard.summary.entry_count == 0

    assert dashboard.targets is not None
    assert dashboard.targets.calorie_target == 2200

    assert dashboard.entries == []
        

@pytest.mark.asyncio
async def test_get_dashboard_groups_entries_by_meal(services):
    (
        user_service,
        food_service,
        entry_service,
        target_service,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            calories_per_100g=165,
            protein_g_per_100g=31,
            carbs_g_per_100g=0,
            fat_g_per_100g=3.6,
        )
    )

    await target_service.create_or_replace_target(
        user_id=user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            meal_type="breakfast",
            consumed_at=datetime(2026, 5, 10, 8, 0, tzinfo=timezone.utc),
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=200,
            meal_type="dinner",
            consumed_at=datetime(2026, 5, 10, 19, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_dashboard(
        user_id=user.id,
        dashboard_date=date(2026, 5, 10),
    )

    assert [meal.meal_type for meal in dashboard.meals] == [
        "breakfast",
        "lunch",
        "dinner",
        "snack",
        "unspecified",
    ]

    breakfast = dashboard.meals[0]
    dinner = dashboard.meals[2]

    assert breakfast.entry_count == 1
    assert breakfast.total_calories == 165
    assert breakfast.total_protein_g == 31
    assert len(breakfast.entries) == 1
    assert breakfast.entries[0].meal_type == "breakfast"

    assert dinner.entry_count == 1
    assert dinner.total_calories == 330
    assert dinner.total_protein_g == 62
    assert len(dinner.entries) == 1
    assert dinner.entries[0].meal_type == "dinner"

@pytest.mark.asyncio
async def test_get_weekly_dashboard_returns_monday_to_sunday_week(services):
    (
        user_service,
        _,
        _,
        _,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    dashboard = await dashboard_service.get_weekly_dashboard(
        user_id=user.id,
        target_date=date(2026, 5, 14),  # Thursday
    )

    assert dashboard.week_start == date(2026, 5, 11)
    assert dashboard.week_end == date(2026, 5, 17)
    assert len(dashboard.days) == 7

    assert dashboard.days[0].date == date(2026, 5, 11)
    assert dashboard.days[-1].date == date(2026, 5, 17)

@pytest.mark.asyncio
async def test_get_weekly_dashboard_returns_zero_days_without_entries(services):
    (
        user_service,
        _,
        _,
        _,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    dashboard = await dashboard_service.get_weekly_dashboard(
        user_id=user.id,
        target_date=date(2026, 5, 14),
    )

    for day in dashboard.days:
        assert day.total_calories == 0
        assert day.total_protein_g == 0
        assert day.total_carbs_g == 0
        assert day.total_fat_g == 0
        assert day.entry_count == 0
        assert day.calorie_target is None
        assert day.calories_remaining is None
        assert day.calories_percent is None

@pytest.mark.asyncio
async def test_get_weekly_dashboard_includes_entries_on_correct_days(services):
    (
        user_service,
        food_service,
        entry_service,
        _,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

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
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            consumed_at=datetime(2026, 5, 11, 8, 0, tzinfo=timezone.utc),
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=200,
            consumed_at=datetime(2026, 5, 13, 8, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_weekly_dashboard(
        user_id=user.id,
        target_date=date(2026, 5, 14),
    )

    monday = dashboard.days[0]
    wednesday = dashboard.days[2]

    assert monday.date == date(2026, 5, 11)
    assert monday.total_calories == 165
    assert monday.total_protein_g == 31
    assert monday.entry_count == 1

    assert wednesday.date == date(2026, 5, 13)
    assert wednesday.total_calories == 330
    assert wednesday.total_protein_g == 62
    assert wednesday.entry_count == 1

@pytest.mark.asyncio
async def test_get_weekly_dashboard_ignores_other_users_entries(services):
    (
        user_service,
        food_service,
        entry_service,
        _,
        dashboard_service,
    ) = services

    user = await create_user(user_service)
    other_user = await create_user(user_service)

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
        user_id=other_user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=300,
            consumed_at=datetime(2026, 5, 11, 8, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_weekly_dashboard(
        user_id=user.id,
        target_date=date(2026, 5, 14),
    )

    for day in dashboard.days:
        assert day.total_calories == 0
        assert day.entry_count == 0

@pytest.mark.asyncio
async def test_get_weekly_dashboard_includes_target_comparison(services):
    (
        user_service,
        food_service,
        entry_service,
        target_service,
        dashboard_service,
    ) = services

    user = await create_user(user_service)

    food = await food_service.create_food(
        CreateFoodSchema(
            name="Chicken breast",
            calories_per_100g=165,
            protein_g_per_100g=31,
            carbs_g_per_100g=0,
            fat_g_per_100g=3.6,
        )
    )

    await target_service.create_or_replace_target(
        user_id=user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    await entry_service.create_entry(
        user_id=user.id,
        data=CreateFoodEntrySchema(
            food_id=food.id,
            quantity_g=100,
            consumed_at=datetime(2026, 5, 11, 8, 0, tzinfo=timezone.utc),
        ),
    )

    dashboard = await dashboard_service.get_weekly_dashboard(
        user_id=user.id,
        target_date=date(2026, 5, 14),
    )

    monday = dashboard.days[0]
    tuesday = dashboard.days[1]

    assert monday.calorie_target == 2200
    assert monday.calories_remaining == 2035
    assert monday.calories_percent == 7.5

    assert tuesday.calorie_target == 2200
    assert tuesday.calories_remaining == 2200
    assert tuesday.calories_percent == 0