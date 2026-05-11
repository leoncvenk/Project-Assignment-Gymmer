import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager

from app.core.database import get_db
from app.main import app
from app.schemas.user_profile_schema import CreateUserProfileSchema, UpdateUserProfileSchema
from app.schemas.user_schema import CreateUserSchema
from app.schemas.nutrition_target_schema import CreateNutritionTargetSchema
from app.services.user_profile_service import (
    USER_PROFILES_COLLECTION,
    UserProfileService,
)
from app.services.user_service import USERS_COLLECTION, UserService
from app.services.nutrition_target_service import (
    NUTRITION_TARGETS_COLLECTION,
    NutritionTargetService
)


@pytest_asyncio.fixture
async def services():
    async with LifespanManager(app):
        db = get_db()
        await db[USER_PROFILES_COLLECTION].delete_many({})
        await db[USERS_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})

        user_service = UserService()
        profile_service = UserProfileService()
        nutrition_target_service = NutritionTargetService()

        user = await user_service.create_user(
            CreateUserSchema(
                username="luka",
                email="luka@example.com",
                password="password123",
            )
        )

        yield user, user_service, profile_service, nutrition_target_service

        await db[USER_PROFILES_COLLECTION].delete_many({})
        await db[USERS_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})



def valid_profile_payload():
    return CreateUserProfileSchema(
        height_cm=180,
        weight_kg=85,
        goal_weight_kg=79,
        age=22,
        sex="male",
        activity_level="moderate",
        goal_type="lose_weight",
    )


@pytest.mark.asyncio
async def test_create_profile_stores_profile(services):
    user, _, profile_service, _ = services

    profile = await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    assert profile.id is not None
    assert profile.user_id == user.id
    assert profile.height_cm == 180
    assert profile.weight_kg == 85
    assert profile.goal_weight_kg == 79
    assert profile.age == 22
    assert profile.sex == "male"
    assert profile.activity_level == "moderate"
    assert profile.goal_type == "lose_weight"


@pytest.mark.asyncio
async def test_get_profile_by_user_id_returns_existing_profile(services):
    user, _, profile_service, _ = services

    created = await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    found = await profile_service.get_profile_by_user_id(user.id)

    assert found is not None
    assert found.id == created.id
    assert found.user_id == user.id
    assert found.height_cm == 180


@pytest.mark.asyncio
async def test_get_profile_by_user_id_missing_returns_none(services):
    _, _, profile_service, _ = services

    result = await profile_service.get_profile_by_user_id("missing-user-id")

    assert result is None


@pytest.mark.asyncio
async def test_create_profile_marks_user_profile_completed(services):
    user, user_service, profile_service, _ = services

    before = await user_service.get_user_by_id(user.id)
    assert before.profile_completed is False

    await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    after = await user_service.get_user_by_id(user.id)

    assert after is not None
    assert after.profile_completed is True


@pytest.mark.asyncio
async def test_create_profile_replaces_existing_profile(services):
    user, _, profile_service, _ = services

    first = await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    second = await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=CreateUserProfileSchema(
            height_cm=181,
            weight_kg=84,
            goal_weight_kg=78,
            age=23,
            sex="male",
            activity_level="active",
            goal_type="lose_weight",
        ),
    )

    assert second.id == first.id
    assert second.user_id == user.id
    assert second.height_cm == 181
    assert second.weight_kg == 84
    assert second.goal_weight_kg == 78
    assert second.age == 23
    assert second.sex == "male"
    assert second.activity_level == "active"


@pytest.mark.asyncio
async def test_update_profile_partial(services):
    user, _, profile_service, _ = services

    created = await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    updated = await profile_service.update_profile(
        user_id=user.id,
        data=UpdateUserProfileSchema(weight_kg=83),
    )

    assert updated is not None
    assert updated.id == created.id
    assert updated.height_cm == 180
    assert updated.weight_kg == 83
    assert updated.goal_weight_kg == 79
    assert updated.age == 22
    assert updated.sex == "male"


@pytest.mark.asyncio
async def test_update_missing_profile_returns_none(services):
    _, _, profile_service, _ = services

    result = await profile_service.update_profile(
        user_id="missing-user-id",
        data=UpdateUserProfileSchema(weight_kg=83),
    )

    assert result is None

@pytest.mark.asyncio
async def test_update_profile_updates_age_and_sex(services):
    user, _, profile_service, _ = services

    created = await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    updated = await profile_service.update_profile(
        user_id=user.id,
        data=UpdateUserProfileSchema(
            age=23,
            sex="female",
        ),
    )

    assert updated is not None
    assert updated.id == created.id
    assert updated.age == 23
    assert updated.sex == "female"

@pytest.mark.asyncio
async def test_create_profile_auto_creates_nutrition_target(services):
    user, _, profile_service, target_service = services

    await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    target = await target_service.get_target_by_user_id(user.id)

    assert target is not None
    assert target.source == "profile_estimate"
    assert target.calorie_target == 2498
    assert target.protein_target_g == 170
    assert target.fat_target_g == 68
    assert target.carbs_target_g == 301.5

@pytest.mark.asyncio
async def test_replace_profile_recalculates_profile_estimate_target(services):
    user, _, profile_service, target_service = services

    await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    first_target = await target_service.get_target_by_user_id(user.id)

    await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=CreateUserProfileSchema(
            height_cm=180,
            weight_kg=80,
            goal_weight_kg=79,
            age=22,
            sex="male",
            activity_level="moderate",
            goal_type="lose_weight",
        ),
    )

    second_target = await target_service.get_target_by_user_id(user.id)

    assert second_target is not None
    assert first_target is not None
    assert second_target.id == first_target.id
    assert second_target.source == "profile_estimate"
    assert second_target.calorie_target != first_target.calorie_target

@pytest.mark.asyncio
async def test_create_profile_does_not_overwrite_manual_nutrition_target(services):
    user, _, profile_service, target_service = services

    manual_target = await target_service.create_or_replace_target(
        user_id=user.id,
        data=CreateNutritionTargetSchema(
            calorie_target=3000,
            protein_target_g=220,
            carbs_target_g=350,
            fat_target_g=90,
            source="manual",
        ),
    )

    await profile_service.create_or_replace_profile(
        user_id=user.id,
        data=valid_profile_payload(),
    )

    target = await target_service.get_target_by_user_id(user.id)

    assert target is not None
    assert target.id == manual_target.id
    assert target.source == "manual"
    assert target.calorie_target == 3000
    assert target.protein_target_g == 220