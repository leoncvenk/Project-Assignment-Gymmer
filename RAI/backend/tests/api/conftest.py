import pytest_asyncio

from app.core.database import get_db
from app.services.user_service import USERS_COLLECTION
from app.services.user_profile_service import USER_PROFILES_COLLECTION
from app.services.food_service import FOODS_COLLECTION
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION
from app.services.nutrition_target_service import NUTRITION_TARGETS_COLLECTION


@pytest_asyncio.fixture(autouse=True)
async def clean_test_database():
    db = get_db()

    await db[USERS_COLLECTION].delete_many({})
    await db[USER_PROFILES_COLLECTION].delete_many({})
    await db[FOODS_COLLECTION].delete_many({})
    await db[FOOD_ENTRIES_COLLECTION].delete_many({})
    await db[NUTRITION_TARGETS_COLLECTION].delete_many({})

    yield

    await db[USERS_COLLECTION].delete_many({})
    await db[USER_PROFILES_COLLECTION].delete_many({})
    await db[FOODS_COLLECTION].delete_many({})
    await db[FOOD_ENTRIES_COLLECTION].delete_many({})
    await db[NUTRITION_TARGETS_COLLECTION].delete_many({})