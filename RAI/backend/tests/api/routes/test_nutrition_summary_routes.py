import pytest

from httpx import AsyncClient

from tests.api.conftest import auth_headers, register_and_login

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
        headers=auth_headers(token),
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
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
            "consumed_at": "2026-05-10T08:00:00Z",
        },
    )

    await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 200,
            "consumed_at": "2026-05-10T18:00:00Z",
        },
    )

    response = await client.get(
        "/users/me/nutrition-summary?date=2026-05-10",
        headers=auth_headers(token),
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
        headers=auth_headers(token),
    )

    assert response.status_code == 422