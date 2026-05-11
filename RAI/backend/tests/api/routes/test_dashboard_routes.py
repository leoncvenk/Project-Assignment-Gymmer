from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.main import app
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION
from app.services.food_service import FOODS_COLLECTION
from app.services.nutrition_target_service import NUTRITION_TARGETS_COLLECTION
from app.services.user_service import USERS_COLLECTION


def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"


@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        db = get_db()

        await db[USERS_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})
        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})

        transport = ASGITransport(app=app)

        async with AsyncClient(
            transport=transport,
            base_url="http://test",
        ) as test_client:
            yield test_client

        await db[USERS_COLLECTION].delete_many({})
        await db[FOODS_COLLECTION].delete_many({})
        await db[FOOD_ENTRIES_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})


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

    assert register_response.status_code == 201

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


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


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


async def create_target(client: AsyncClient, token: str):
    response = await client.put(
        "/users/me/nutrition-target",
        headers=auth_headers(token),
        json={
            "calorie_target": 2200,
            "protein_target_g": 180,
            "carbs_target_g": 220,
            "fat_target_g": 70,
        },
    )

    assert response.status_code == 200

    return response.json()


@pytest.mark.asyncio
async def test_get_dashboard_requires_auth(client):
    response = await client.get(
        "/users/me/dashboard?date=2026-05-10",
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_get_dashboard_rejects_invalid_date(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/dashboard?date=invalid-date",
        headers=auth_headers(token),
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_dashboard_without_target_returns_empty_state(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/dashboard?date=2026-05-10",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["date"] == "2026-05-10"
    assert data["profile_completed"] is False
    assert data["has_nutrition_target"] is False

    assert data["summary"]["total_calories"] == 0
    assert data["summary"]["total_protein_g"] == 0
    assert data["summary"]["total_carbs_g"] == 0
    assert data["summary"]["total_fat_g"] == 0
    assert data["summary"]["entry_count"] == 0

    assert data["targets"] is None
    assert data["remaining"] is None
    assert data["progress"] is None

    assert data["entries"] == []

    assert data["meals"] == [
        {
            "meal_type": "breakfast",
            "total_calories": 0,
            "total_protein_g": 0,
            "total_carbs_g": 0,
            "total_fat_g": 0,
            "entry_count": 0,
            "entries": [],
        },
        {
            "meal_type": "lunch",
            "total_calories": 0,
            "total_protein_g": 0,
            "total_carbs_g": 0,
            "total_fat_g": 0,
            "entry_count": 0,
            "entries": [],
        },
        {
            "meal_type": "dinner",
            "total_calories": 0,
            "total_protein_g": 0,
            "total_carbs_g": 0,
            "total_fat_g": 0,
            "entry_count": 0,
            "entries": [],
        },
        {
            "meal_type": "snack",
            "total_calories": 0,
            "total_protein_g": 0,
            "total_carbs_g": 0,
            "total_fat_g": 0,
            "entry_count": 0,
            "entries": [],
        },
        {
            "meal_type": "unspecified",
            "total_calories": 0,
            "total_protein_g": 0,
            "total_carbs_g": 0,
            "total_fat_g": 0,
            "entry_count": 0,
            "entries": [],
        },
    ]


@pytest.mark.asyncio
async def test_get_dashboard_with_target_and_entries(client):
    token = await register_and_login(client)
    food_id = await create_food(client)
    await create_target(client, token)

    await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
            "meal_type": "breakfast",
            "consumed_at": "2026-05-10T08:00:00Z",
        },
    )

    response = await client.get(
        "/users/me/dashboard?date=2026-05-10",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["has_nutrition_target"] is True

    assert data["summary"]["total_calories"] == 165
    assert data["summary"]["total_protein_g"] == 31
    assert data["summary"]["total_carbs_g"] == 0
    assert data["summary"]["total_fat_g"] == 3.6
    assert data["summary"]["entry_count"] == 1

    assert data["targets"]["calorie_target"] == 2200
    assert data["targets"]["protein_target_g"] == 180

    assert data["remaining"]["calories"] == 2035
    assert data["remaining"]["protein_g"] == 149
    assert data["remaining"]["carbs_g"] == 220
    assert data["remaining"]["fat_g"] == 66.4

    assert data["progress"]["calories_percent"] == 7.5
    assert data["progress"]["protein_percent"] == 17.22
    assert data["progress"]["carbs_percent"] == 0
    assert data["progress"]["fat_percent"] == 5.14

    assert len(data["entries"]) == 1
    assert data["entries"][0]["food_id"] == food_id
    assert data["entries"][0]["quantity_g"] == 100

    assert data["entries"][0]["meal_type"] == "breakfast"

    assert [meal["meal_type"] for meal in data["meals"]] == [
        "breakfast",
        "lunch",
        "dinner",
        "snack",
        "unspecified",
    ]

    breakfast = data["meals"][0]

    assert breakfast["meal_type"] == "breakfast"
    assert breakfast["total_calories"] == 165
    assert breakfast["total_protein_g"] == 31
    assert breakfast["total_carbs_g"] == 0
    assert breakfast["total_fat_g"] == 3.6
    assert breakfast["entry_count"] == 1
    assert len(breakfast["entries"]) == 1
    assert breakfast["entries"][0]["meal_type"] == "breakfast"


@pytest.mark.asyncio
async def test_get_dashboard_ignores_other_users_data(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    await create_target(client, first_token)

    await client.put(
        "/users/me/nutrition-target",
        headers=auth_headers(second_token),
        json={
            "calorie_target": 3000,
            "protein_target_g": 250,
            "carbs_target_g": 350,
            "fat_target_g": 100,
        },
    )

    await client.post(
        "/users/me/food-entries",
        headers=auth_headers(second_token),
        json={
            "food_id": food_id,
            "quantity_g": 300,
            "consumed_at": "2026-05-10T08:00:00Z",
        },
    )

    response = await client.get(
        "/users/me/dashboard?date=2026-05-10",
        headers=auth_headers(first_token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["summary"]["total_calories"] == 0
    assert data["summary"]["entry_count"] == 0

    assert data["targets"]["calorie_target"] == 2200
    assert data["entries"] == []

    assert [meal["entry_count"] for meal in data["meals"]] == [0, 0, 0, 0, 0]