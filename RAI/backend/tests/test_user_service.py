import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from uuid import uuid4

from app.core.database import get_db
from app.core.security import verify_password
from app.main import app
from app.schemas.user_schema import CreateUserSchema
from app.services.user_service import USERS_COLLECTION, UserService

def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"

@pytest_asyncio.fixture
async def user_service():
    async with LifespanManager(app):
        db = get_db()
        await db[USERS_COLLECTION].delete_many({})

        yield UserService()

        await db[USERS_COLLECTION].delete_many({})


@pytest.mark.asyncio
async def test_create_user_stores_user(user_service):
    email = unique_email()

    user = await user_service.create_user(
        CreateUserSchema(
            username="luka",
            email=email,
            password="password123",
        )
    )

    assert user is not None
    assert user.id is not None
    assert user.username == "luka"
    assert user.email == email
    assert user.hashed_password != "password123"
    assert verify_password("password123", user.hashed_password)


@pytest.mark.asyncio
async def test_create_user_duplicate_email_returns_none(user_service):
    email = unique_email()

    payload = CreateUserSchema(
        username="luka",
        email=email,
        password="password123",
    )

    first = await user_service.create_user(payload)
    second = await user_service.create_user(payload)

    assert first is not None
    assert second is None


@pytest.mark.asyncio
async def test_get_user_by_email_existing_user(user_service):
    email = unique_email()

    user = await user_service.create_user(
        CreateUserSchema(
            username="luka",
            email=email,
            password="password123",
        )
    )

    result = await user_service.get_user_by_email(email)

    assert result is not None
    assert result.id == user.id
    assert result.email == user.email


@pytest.mark.asyncio
async def test_get_user_by_email_missing_user_returns_none(user_service):
    result = await user_service.get_user_by_email("missing@example.com")

    assert result is None


@pytest.mark.asyncio
async def test_get_user_by_id_existing_user(user_service):
    email = unique_email()
    
    user = await user_service.create_user(
        CreateUserSchema(
            username="luka",
            email=email,
            password="password123",
        )
    )

    result = await user_service.get_user_by_id(user.id)

    assert result is not None
    assert result.id == user.id
    assert result.email == user.email


@pytest.mark.asyncio
async def test_get_user_by_id_missing_user_returns_none(user_service):
    result = await user_service.get_user_by_id("missing-id")

    assert result is None