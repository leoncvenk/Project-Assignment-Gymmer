from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.main import app
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION
from app.services.food_service import FOODS_COLLECTION


def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"


@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        db = get_db()

        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})
        await db["users"].delete_many({})

        transport = ASGITransport(app=app)

        async with AsyncClient(
            transport=transport,
            base_url="http://test",
        ) as test_client:
            yield test_client

        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})
        await db["users"].delete_many({})


async def register_and_login(client: AsyncClient) -> str:
    email = unique_email()
    password = "Password123!"

    register_response = await client.post(
        "/auth/register",
        json={
            "username": f"user-{uuid4().hex[:8]}",
            "email": email,
            "password": password,
        },
    )

    assert register_response.status_code in [200, 201]

    login_response = await client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]
    assert token

    return token


async def create_food(client: AsyncClient) -> str:
    response = await client.post(
        "/foods",
        json={
            "name": "Chicken breast",
            "calories_per_100g": 165,
            "protein_g_per_100g": 31,
            "carbs_g_per_100g": 0,
            "fat_g_per_100g": 3.6,
        },
    )

    assert response.status_code in [200, 201]

    return response.json()["id"]


@pytest.mark.asyncio
async def test_get_nutrition_summary_requires_auth(client):
    response = await client.get(
        "/users/me/nutrition-summary?date=2026-05-10",
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_get_nutrition_summary_returns_zero_for_empty_day(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/nutrition-summary?date=2026-05-10",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["date"] == "2026-05-10"
    assert data["total_calories"] == 0
    assert data["total_protein_g"] == 0
    assert data["total_carbs_g"] == 0
    assert data["total_fat_g"] == 0
    assert data["entry_count"] == 0


@pytest.mark.asyncio
async def test_get_nutrition_summary_sums_entries_for_authenticated_user(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "food_id": food_id,
            "quantity_g": 100,
            "consumed_at": "2026-05-10T08:00:00Z",
        },
    )

    await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "food_id": food_id,
            "quantity_g": 200,
            "consumed_at": "2026-05-10T18:00:00Z",
        },
    )

    response = await client.get(
        "/users/me/nutrition-summary?date=2026-05-10",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["total_calories"] == 495
    assert data["total_protein_g"] == 93
    assert data["total_carbs_g"] == 0
    assert data["total_fat_g"] == 10.8
    assert data["entry_count"] == 2


@pytest.mark.asyncio
async def test_get_nutrition_summary_ignores_other_users_entries(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {first_token}"},
        json={
            "food_id": food_id,
            "quantity_g": 100,
            "consumed_at": "2026-05-10T08:00:00Z",
        },
    )

    await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {second_token}"},
        json={
            "food_id": food_id,
            "quantity_g": 200,
            "consumed_at": "2026-05-10T08:00:00Z",
        },
    )

    response = await client.get(
        "/users/me/nutrition-summary?date=2026-05-10",
        headers={"Authorization": f"Bearer {first_token}"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["total_calories"] == 165
    assert data["total_protein_g"] == 31
    assert data["total_fat_g"] == 3.6
    assert data["entry_count"] == 1


@pytest.mark.asyncio
async def test_get_nutrition_summary_rejects_invalid_date(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/nutrition-summary?date=invalid-date",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 422