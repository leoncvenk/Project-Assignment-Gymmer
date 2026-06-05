import asyncio
import os

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()


async def main():
    mongo_uri = os.environ["MONGO_URI"]
    db_name = os.environ["TEST_DB_NAME"]

    if db_name in {"gymmer", "prod", "production"} or not db_name.startswith("rai_test_"):
        raise RuntimeError(f"Refusing to clear unsafe database: {db_name}")

    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]

    collections = await db.list_collection_names()

    for collection in collections:
        await db[collection].delete_many({})

    client.close()


if __name__ == "__main__":
    asyncio.run(main())