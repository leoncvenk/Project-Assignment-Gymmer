import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.main import app
from app.services.user_service import USERS_COLLECTION


@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        db = get_db()
        await db[USERS_COLLECTION].delete_many({})

        transport = ASGITransport(app=app)

        async with AsyncClient(
            transport=transport,
            base_url="http://test",
        ) as test_client:
            yield test_client

        await db[USERS_COLLECTION].delete_many({})


@pytest.mark.asyncio
async def test_register_user(client):
    response = await client.post(
        "/auth/register",
        json={
            "username": "luka",
            "email": "luka@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["username"] == "luka"
    assert data["email"] == "luka@example.com"
    assert "id" in data
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email_returns_409(client):
    payload = {
        "username": "luka",
        "email": "luka@example.com",
        "password": "password123",
    }

    first = await client.post("/auth/register", json=payload)
    second = await client.post("/auth/register", json=payload)

    assert first.status_code == 201
    assert second.status_code == 409


@pytest.mark.asyncio
async def test_login_user_returns_token(client):
    await client.post(
        "/auth/register",
        json={
            "username": "luka",
            "email": "luka@example.com",
            "password": "password123",
        },
    )

    response = await client.post(
        "/auth/login",
        json={
            "email": "luka@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_password_returns_401(client):
    await client.post(
        "/auth/register",
        json={
            "username": "luka",
            "email": "luka@example.com",
            "password": "password123",
        },
    )

    response = await client.post(
        "/auth/login",
        json={
            "email": "luka@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_email_returns_401(client):
    response = await client.post(
        "/auth/login",
        json={
            "email": "missing@example.com",
            "password": "password123",
        },
    )

    assert response.status_code == 401

@pytest.mark.asyncio
async def test_auth_me_returns_current_user(client):
    register = await client.post(
        "/auth/register",
        json={
            "username": "luka",
            "email": "luka@example.com",
            "password": "password123",
        },
    )

    login = await client.post(
        "/auth/login",
        json={
            "email": "luka@example.com",
            "password": "password123"
        },
    )

    token = login.json()["access_token"]

    response = await client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == register.json()["id"]
    assert data["username"] == "luka"
    assert data["email"] == "luka@example.com"
    assert data["roles"] == ["user"]
    assert data["profile_completed"] is False
    assert "created_at" not in data
    assert "updated_at" not in data
    assert "hashed_password" not in data

@pytest.mark.asyncio
async def test_auth_me_missing_token_returns_401(client):
    response = await client.get("/auth/me")

    assert response.status_code == 401
 