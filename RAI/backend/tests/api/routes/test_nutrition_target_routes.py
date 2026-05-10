from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.main import app
from app.services.nutrition_target_service import (
    NUTRITION_TARGETS_COLLECTION,
)


def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"


@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        db = get_db()

        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})
        await db["users"].delete_many({})

        transport = ASGITransport(app=app)

        async with AsyncClient(
            transport=transport,
            base_url="http://test",
        ) as test_client:
            yield test_client

        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})
        await db["users"].delete_many({})


async def register_and_login(client: AsyncClient) -> str:
    email = unique_email()

    register_response = await client.post(
        "/auth/register",
        json={
            "username": f"user-{uuid4().hex[:8]}",
            "email": email,
            "password": "Password123!",
        },
    )

    assert register_response.status_code == 201

    login_response = await client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "Password123!",
        },
    )

    assert login_response.status_code == 200

    return login_response.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def valid_target_payload() -> dict:
    return {
        "calorie_target": 2200,
        "protein_target_g": 180,
        "carbs_target_g": 220,
        "fat_target_g": 70,
    }


@pytest.mark.asyncio
async def test_get_target_without_existing_target_returns_404(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/nutrition-target",
        headers=auth_headers(token),
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_put_target_creates_target(client):
    token = await register_and_login(client)

    response = await client.put(
        "/users/me/nutrition-target",
        json=valid_target_payload(),
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["calorie_target"] == 2200
    assert data["protein_target_g"] == 180
    assert data["carbs_target_g"] == 220
    assert data["fat_target_g"] == 70


@pytest.mark.asyncio
async def test_get_target_returns_existing_target(client):
    token = await register_and_login(client)

    create_response = await client.put(
        "/users/me/nutrition-target",
        json=valid_target_payload(),
        headers=auth_headers(token),
    )

    response = await client.get(
        "/users/me/nutrition-target",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    assert response.json()["id"] == create_response.json()["id"]


@pytest.mark.asyncio
async def test_patch_target_updates_partial_fields(client):
    token = await register_and_login(client)

    create_response = await client.put(
        "/users/me/nutrition-target",
        json=valid_target_payload(),
        headers=auth_headers(token),
    )

    response = await client.patch(
        "/users/me/nutrition-target",
        json={
            "protein_target_g": 200,
            "fat_target_g": 80,
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == create_response.json()["id"]

    assert data["calorie_target"] == 2200
    assert data["protein_target_g"] == 200
    assert data["carbs_target_g"] == 220
    assert data["fat_target_g"] == 80


@pytest.mark.asyncio
async def test_patch_missing_target_returns_404(client):
    token = await register_and_login(client)

    response = await client.patch(
        "/users/me/nutrition-target",
        json={
            "protein_target_g": 200,
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_target_routes_require_authentication(client):
    response = await client.get(
        "/users/me/nutrition-target",
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_target_routes_are_user_isolated(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)

    await client.put(
        "/users/me/nutrition-target",
        json={
            "calorie_target": 3000,
            "protein_target_g": 250,
            "carbs_target_g": 350,
            "fat_target_g": 100,
        },
        headers=auth_headers(second_token),
    )

    await client.put(
        "/users/me/nutrition-target",
        json={
            "calorie_target": 2200,
            "protein_target_g": 180,
            "carbs_target_g": 220,
            "fat_target_g": 70,
        },
        headers=auth_headers(first_token),
    )

    response = await client.get(
        "/users/me/nutrition-target",
        headers=auth_headers(first_token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["calorie_target"] == 2200
    assert data["protein_target_g"] == 180