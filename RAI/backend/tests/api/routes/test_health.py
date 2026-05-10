import pytest
from httpx import AsyncClient
from asgi_lifespan import LifespanManager

from app.main import app


@pytest.mark.asyncio
async def test_health_db_returns_200():
    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/health/db")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}