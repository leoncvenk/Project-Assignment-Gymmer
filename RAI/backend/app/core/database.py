from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient | None = None


async def connect_to_mongo():
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)


def get_db():
    if client is None:
        raise RuntimeError("Database not initialized yet")
    return client[settings.DB_NAME]


async def close_mongo_connection():
    global client
    if client:
        client.close()
        client = None