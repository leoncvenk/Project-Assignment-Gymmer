import asyncio
import os

from motor.motor_asyncio import AsyncIOMotorClient


async def main():
    mongo_uri = os.environ["MONGO_URI"]
    db_name = os.environ["DB_NAME"]

    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]

    collections = await db.list_collection_names()

    for collection in collections:
        await db[collection].delete_many({})

    client.close()


if __name__ == "__main__":
    asyncio.run(main())