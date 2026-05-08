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