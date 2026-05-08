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
async def test_update_food_partial(client):
    create = await client.post("/foods", json={"name": "Apple"})
    food_id = create.json()["id"]

    response = await client.patch(
        f"/foods/{food_id}",
        json={"name": "Green Apple"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Green Apple"


@pytest.mark.asyncio
async def test_update_food_does_not_override_other_fields(client):
    create = await client.post(
        "/foods",
        json={"name": "Milk", "brand": "Alpsko"},
    )
    food_id = create.json()["id"]

    await client.patch(
        f"/foods/{food_id}",
        json={"name": "Updated Milk"},
    )

    response = await client.get(f"/foods/{food_id}")

    assert response.json()["brand"] == "Alpsko"


@pytest.mark.asyncio
async def test_update_food_invalid(client):
    create = await client.post("/foods", json={"name": "Rice"})
    food_id = create.json()["id"]

    response = await client.patch(
        f"/foods/{food_id}",
        json={"name": ""},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_food_not_found(client):
    response = await client.patch(
        "/foods/nonexistent",
        json={"name": "Ghost Food"},
    )

    assert response.status_code == 404