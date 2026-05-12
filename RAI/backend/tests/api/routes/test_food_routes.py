from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        transport = ASGITransport(app=app)

        async with AsyncClient(
            transport=transport,
            base_url="http://test",
        ) as test_client:
            yield test_client


@pytest.mark.asyncio
async def test_create_food_route(client):
    response = await client.post(
        "/foods",
        json={"name": "Banana"},
    )

    assert response.status_code in [200, 201]

    data = response.json()
    assert data["name"] == "Banana"
    assert data["brand"] is None


@pytest.mark.asyncio
async def test_create_food_invalid(client):
    response = await client.post(
        "/foods",
        json={"name": ""},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_food_by_id(client):
    create = await client.post("/foods", json={"name": "Apple"})
    food_id = create.json()["id"]

    response = await client.get(f"/foods/{food_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Apple"


@pytest.mark.asyncio
async def test_get_food_not_found(client):
    response = await client.get("/foods/nonexistent")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_food_duplicate_barcode_route(client):
    first = await client.post(
        "/foods",
        json={"name": "Milk", "barcode": "123"},
    )

    second = await client.post(
        "/foods",
        json={"name": "Different Milk", "barcode": "123"},
    )

    assert first.json()["id"] == second.json()["id"]

@pytest.mark.asyncio
async def test_create_food_route_with_nutrition_fields(client):
    response = await client.post(
        "/foods",
        json={
            "name": "Banana",
            "calories_per_100g": 89,
            "protein_g_per_100g": 1.1,
            "carbs_g_per_100g": 22.8,
            "fat_g_per_100g": 0.3,
        },
    )

    assert response.status_code in [200, 201]

    data = response.json()
    assert data["name"] == "Banana"
    assert data["calories_per_100g"] == 89
    assert data["protein_g_per_100g"] == 1.1
    assert data["carbs_g_per_100g"] == 22.8
    assert data["fat_g_per_100g"] == 0.3


@pytest.mark.asyncio
async def test_create_food_route_rejects_negative_nutrition(client):
    response = await client.post(
        "/foods",
        json={
            "name": "Broken food",
            "calories_per_100g": -10,
        },
    )

    assert response.status_code == 422

@pytest.mark.asyncio
async def test_search_foods_by_name(client):
    unique = uuid4().hex[:8]
    food_name = f"SearchChicken-{unique}"

    await client.post(
        "/foods",
        json={
            "name": food_name,
        },
    )

    await client.post(
        "/foods",
        json={
            "name": f"SearchRice-{unique}",
        },
    )

    response = await client.get(
        f"/foods?query={food_name}"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == food_name

@pytest.mark.asyncio
async def test_search_foods_by_brand(client):
    unique = uuid4().hex[:8]
    brand = f"SearchBrand-{unique}"

    await client.post(
        "/foods",
        json={
            "name": f"SearchChicken-{unique}",
            "brand": brand,
        },
    )

    await client.post(
        "/foods",
        json={
            "name": f"SearchYogurt-{unique}",
            "brand": f"OtherBrand-{unique}",
        },
    )

    response = await client.get(
        f"/foods?query={brand}"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["brand"] == brand

@pytest.mark.asyncio
async def test_search_foods_case_insensitive(client):
    unique = uuid4().hex[:8]
    food_name = f"SearchChicken-{unique}"

    await client.post(
        "/foods",
        json={
            "name": food_name,
        },
    )

    response = await client.get(
        f"/foods?query={food_name.upper()}"
    )

    assert response.status_code == 200
    assert len(response.json()) == 1

@pytest.mark.asyncio
async def test_search_foods_returns_empty_list_when_no_match(client):
    unique = uuid4().hex[:8]

    await client.post(
        "/foods",
        json={
            "name": f"SearchChicken-{unique}",
        },
    )

    response = await client.get(
        f"/foods?query=no-match-{unique}"
    )

    assert response.status_code == 200
    assert response.json() == []

@pytest.mark.asyncio
async def test_search_foods_rejects_missing_query(client):
    response = await client.get("/foods")

    assert response.status_code == 422

@pytest.mark.asyncio
async def test_search_foods_respects_limit(client):
    unique = uuid4().hex[:8]

    for index in range(3):
        await client.post(
            "/foods",
            json={
                "name": f"SearchChickenLimit-{unique}-{index}",
            },
        )

    response = await client.get(
        f"/foods?query=SearchChickenLimit-{unique}&limit=2"
    )

    assert response.status_code == 200
    assert len(response.json()) == 2

@pytest.mark.asyncio
async def test_search_foods_respects_skip(client):
    unique = uuid4().hex[:8]

    await client.post(
        "/foods",
        json={
            "name": f"SearchChickenSkip-{unique}-1",
        },
    )

    await client.post(
        "/foods",
        json={
            "name": f"SearchChickenSkip-{unique}-2",
        },
    )

    without_skip_response = await client.get(
        f"/foods?query=SearchChickenSkip-{unique}&limit=10&skip=0"
    )

    with_skip_response = await client.get(
        f"/foods?query=SearchChickenSkip-{unique}&limit=10&skip=1"
    )

    assert without_skip_response.status_code == 200
    assert with_skip_response.status_code == 200

    assert len(without_skip_response.json()) == 2
    assert len(with_skip_response.json()) == 1

@pytest.mark.asyncio
async def test_search_foods_rejects_invalid_limit(client):
    response = await client.get(
        "/foods?query=chicken&limit=0"
    )

    assert response.status_code == 422

@pytest.mark.asyncio
async def test_search_foods_rejects_invalid_skip(client):
    response = await client.get(
        "/foods?query=chicken&skip=-1"
    )

    assert response.status_code == 422