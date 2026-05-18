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
async def test_create_food_entry_route_authenticated(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 150,
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["food_id"] == food_id
    assert data["quantity_g"] == 150
    assert data["calories"] == 247.5
    assert data["protein_g"] == 46.5
    assert data["carbs_g"] == 0
    assert data["fat_g"] == 5.4
    assert data["meal_type"] == "unspecified"


@pytest.mark.asyncio
async def test_create_food_entry_requires_auth(client):
    food_id = await create_food(client)

    response = await client.post(
        "/users/me/food-entries",
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert response.status_code in [401, 403]


@pytest.mark.asyncio
async def test_create_food_entry_missing_food_returns_404(client):
    token = await register_and_login(client)

    response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": "missing-food",
            "quantity_g": 100,
        },
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_food_entry_rejects_invalid_quantity(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 0,
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_my_food_entries_returns_only_current_user_entries(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {first_token}"},
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {second_token}"},
        json={
            "food_id": food_id,
            "quantity_g": 200,
        },
    )

    response = await client.get(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {first_token}"},
    )

    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["quantity_g"] == 100


@pytest.mark.asyncio
async def test_get_my_food_entry_by_id(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    response = await client.get(
        f"/users/me/food-entries/{entry_id}",
        headers=auth_headers(token),
    )

    assert response.status_code == 200
    assert response.json()["id"] == entry_id


@pytest.mark.asyncio
async def test_user_cannot_get_other_users_food_entry(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {second_token}"},
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    response = await client.get(
        f"/users/me/food-entries/{entry_id}",
        headers={"Authorization": f"Bearer {first_token}"},
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_my_food_entry(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    delete_response = await client.delete(
        f"/users/me/food-entries/{entry_id}",
        headers=auth_headers(token),
    )

    assert delete_response.status_code == 204

    get_response = await client.get(
        f"/users/me/food-entries/{entry_id}",
        headers=auth_headers(token),
    )

    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_user_cannot_delete_other_users_food_entry(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers={"Authorization": f"Bearer {second_token}"},
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201

    entry_id = create_response.json()["id"]

    delete_response = await client.delete(
        f"/users/me/food-entries/{entry_id}",
        headers={"Authorization": f"Bearer {first_token}"},
    )

    assert delete_response.status_code == 404

    owner_get_response = await client.get(
        f"/users/me/food-entries/{entry_id}",
        headers={"Authorization": f"Bearer {second_token}"},
    )

    assert owner_get_response.status_code == 200
    

@pytest.mark.asyncio
async def test_create_food_entry_with_meal_type(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 150,
            "meal_type": "dinner",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["meal_type"] == "dinner"


@pytest.mark.asyncio
async def test_create_food_entry_rejects_invalid_meal_type(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 150,
            "meal_type": "midnight_feast",
        },
    )

    assert response.status_code == 422

@pytest.mark.asyncio
async def test_update_food_entry_route_authenticated(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201
    entry_id = create_response.json()["id"]

    response = await client.patch(
        f"/users/me/food-entries/{entry_id}",
        headers=auth_headers(token),
        json={
            "quantity_g": 200,
            "meal_type": "dinner",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == entry_id
    assert data["quantity_g"] == 200
    assert data["meal_type"] == "dinner"
    assert data["calories"] == 330
    assert data["protein_g"] == 62
    assert data["fat_g"] == 7.2

@pytest.mark.asyncio
async def test_update_food_entry_requires_auth(client):
    response = await client.patch(
        "/users/me/food-entries/some-entry-id",
        json={
            "quantity_g": 200,
        },
    )

    assert response.status_code in [401, 403]

@pytest.mark.asyncio
async def test_update_food_entry_rejects_invalid_quantity(client):
    token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201
    entry_id = create_response.json()["id"]

    response = await client.patch(
        f"/users/me/food-entries/{entry_id}",
        headers=auth_headers(token),
        json={
            "quantity_g": 0,
        },
    )

    assert response.status_code == 422

@pytest.mark.asyncio
async def test_update_food_entry_missing_returns_404(client):
    token = await register_and_login(client)

    response = await client.patch(
        "/users/me/food-entries/missing-entry",
        headers=auth_headers(token),
        json={
            "quantity_g": 200,
        },
    )

    assert response.status_code == 404

@pytest.mark.asyncio
async def test_user_cannot_update_other_users_food_entry(client):
    first_token = await register_and_login(client)
    second_token = await register_and_login(client)
    food_id = await create_food(client)

    create_response = await client.post(
        "/users/me/food-entries",
        headers=auth_headers(second_token),
        json={
            "food_id": food_id,
            "quantity_g": 100,
        },
    )

    assert create_response.status_code == 201
    entry_id = create_response.json()["id"]

    response = await client.patch(
        f"/users/me/food-entries/{entry_id}",
        headers=auth_headers(first_token),
        json={
            "quantity_g": 200,
        },
    )

    assert response.status_code == 404