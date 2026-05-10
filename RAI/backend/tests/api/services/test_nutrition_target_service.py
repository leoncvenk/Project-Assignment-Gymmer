import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager

from app.core.database import get_db
from app.main import app
from app.schemas.nutrition_target_schema import (
    CreateNutritionTargetSchema,
    UpdateNutritionTargetSchema,
)
from app.services.nutrition_target_service import (
    NUTRITION_TARGETS_COLLECTION,
    NutritionTargetService,
)


def assert_same_target(actual, expected):
    assert actual is not None
    assert actual.id == expected.id
    assert actual.user_id == expected.user_id

    assert actual.calorie_target == expected.calorie_target

    assert actual.protein_target_g == expected.protein_target_g
    assert actual.carbs_target_g == expected.carbs_target_g
    assert actual.fat_target_g == expected.fat_target_g

    assert actual.source == expected.source

    assert actual.created_at is not None
    assert actual.updated_at is not None


@pytest_asyncio.fixture
async def service():
    async with LifespanManager(app):
        db = get_db()

        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})

        yield NutritionTargetService()

        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})


@pytest.mark.asyncio
async def test_create_or_replace_target_creates_target(service):
    target = await service.create_or_replace_target(
        user_id="user-123",
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    result = await service.get_target_by_user_id("user-123")

    assert_same_target(result, target)


@pytest.mark.asyncio
async def test_get_target_by_user_id_missing_returns_none(service):
    result = await service.get_target_by_user_id("missing-user")

    assert result is None


@pytest.mark.asyncio
async def test_create_or_replace_target_replaces_existing_target(service):
    first = await service.create_or_replace_target(
        user_id="user-123",
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    second = await service.create_or_replace_target(
        user_id="user-123",
        data=CreateNutritionTargetSchema(
            calorie_target=2000,
            protein_target_g=160,
            carbs_target_g=180,
            fat_target_g=60,
        ),
    )

    result = await service.get_target_by_user_id("user-123")

    assert result is not None
    assert result.id == first.id
    assert second.id == first.id

    assert result.calorie_target == 2000
    assert result.protein_target_g == 160
    assert result.carbs_target_g == 180
    assert result.fat_target_g == 60


@pytest.mark.asyncio
async def test_create_or_replace_target_preserves_created_at(service):
    first = await service.create_or_replace_target(
        user_id="user-123",
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    second = await service.create_or_replace_target(
        user_id="user-123",
        data=CreateNutritionTargetSchema(
            calorie_target=2000,
            protein_target_g=160,
            carbs_target_g=180,
            fat_target_g=60,
        ),
    )

    assert second.id == first.id
    assert second.created_at is not None


@pytest.mark.asyncio
async def test_update_target_partial(service):
    target = await service.create_or_replace_target(
        user_id="user-123",
        data=CreateNutritionTargetSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),
    )

    updated = await service.update_target(
        user_id="user-123",
        data=UpdateNutritionTargetSchema(
            protein_target_g=200,
            fat_target_g=80,
        ),
    )

    assert updated is not None
    assert updated.id == target.id

    assert updated.calorie_target == 2200
    assert updated.protein_target_g == 200
    assert updated.carbs_target_g == 220
    assert updated.fat_target_g == 80


@pytest.mark.asyncio
async def test_update_missing_target_returns_none(service):
    result = await service.update_target(
        user_id="missing-user",
        data=UpdateNutritionTargetSchema(
            calorie_target=2000,
        ),
    )

    assert result is None