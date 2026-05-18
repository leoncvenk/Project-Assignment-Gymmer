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

@pytest.mark.asyncio
async def test_get_weekly_dashboard_requires_auth(client):
    response = await client.get(
        "/users/me/dashboard/weekly?date=2026-05-14"
    )

    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_get_weekly_dashboard_rejects_invalid_date(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/dashboard/weekly?date=invalid-date",
        headers=auth_headers(token),
    )

    assert response.status_code == 422

@pytest.mark.asyncio
async def test_get_weekly_dashboard_returns_monday_to_sunday_week(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/dashboard/weekly?date=2026-05-14",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()

    assert data["week_start"] == "2026-05-11"
    assert data["week_end"] == "2026-05-17"
    assert len(data["days"]) == 7
    assert data["days"][0]["date"] == "2026-05-11"
    assert data["days"][-1]["date"] == "2026-05-17"

@pytest.mark.asyncio
async def test_get_weekly_dashboard_includes_entries_and_target_comparison(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    await create_target(client, token)

    create_entry_response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
            "consumed_at": "2026-05-11T08:00:00Z",
        },
    )

    assert create_entry_response.status_code == 201

    response = await client.get(
        "/users/me/dashboard/weekly?date=2026-05-14",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()

    monday = data["days"][0]
    tuesday = data["days"][1]

    assert monday["date"] == "2026-05-11"
    assert monday["total_calories"] == 165
    assert monday["total_protein_g"] == 31
    assert monday["entry_count"] == 1
    assert monday["calorie_target"] == 2200
    assert monday["calories_remaining"] == 2035
    assert monday["calories_percent"] == 7.5

    assert tuesday["date"] == "2026-05-12"
    assert tuesday["total_calories"] == 0
    assert tuesday["entry_count"] == 0
    assert tuesday["calorie_target"] == 2200
    assert tuesday["calories_remaining"] == 2200
    assert tuesday["calories_percent"] == 0

@pytest.mark.asyncio
async def test_get_weekly_dashboard_ignores_other_users_entries(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    await client.post(
        "/users/me/food-entries",
        headers=auth_headers(second_token),
        json={
            "food_id": food_id,
            "quantity_g": 300,
            "consumed_at": "2026-05-11T08:00:00Z",
        },
    )

    response = await client.get(
        "/users/me/dashboard/weekly?date=2026-05-14",
        headers=auth_headers(first_token),
    )

    assert response.status_code == 200

    data = response.json()

    for day in data["days"]:
        assert day["total_calories"] == 0
        assert day["entry_count"] == 0