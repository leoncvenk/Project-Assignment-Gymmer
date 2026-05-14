import pytest_asyncio

from app.core.database import close_mongo_connection, connect_to_mongo, get_db


@pytest_asyncio.fixture(scope="session", autouse=True)
async def init_test_db():
    await connect_to_mongo()
    yield
    await close_mongo_connection()


@pytest_asyncio.fixture(autouse=True)
async def clean_database():
    db = get_db()

    collections = await db.list_collection_names()

    for collection in collections:
        await db[collection].delete_many({})

    yield