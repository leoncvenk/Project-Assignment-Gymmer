from uuid import uuid4

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient

from app.main import app

def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"

async def register_and_login(client: AsyncClient) -> str:
    email = unique_email()

    register = await client.post(
        "/auth/register",
        json={
            "username": f"user-{uuid4().hex[:8]}",
            "email": email,
            "password": "password123",
        },
    )

    assert register.status_code == 201

    login = await client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "password123",
        },
    )

    assert login.status_code == 200

    return login.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as client:
            yield client

@pytest.mark.asyncio
async def test_food_recognition_upload_endpoint_returns_predictions(client):
    token = await register_and_login(client)

    response = await client.post(
        "/users/me/food-recognition",
        headers=auth_headers(token),
        files={
            "image": ("banana.jpg", b"fake-image-bytes", "image/jpeg"),
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "predictions" in data
    assert len(data["predictions"]) == 1
    assert data["predictions"][0]["label"] == "banana"
    assert data["predictions"][0]["confidence"] == 0.94
    assert data["predictions"][0]["candidates"] == []

@pytest.mark.asyncio
async def test_food_recognition_upload_endpoint_requires_auth(client):
    response = await client.post(
        "/users/me/food-recognition",
        files={
            "image": ("banana.jpg", b"fake-image-bytes", "image/jpeg"),
        },
    )

    assert response.status_code == 401

@pytest.mark.asyncio
async def test_food_recognition_upload_endpoint_requires_image(client):
    token = await register_and_login(client)

    response = await client.post(
        "/users/me/food-recognition",
        headers=auth_headers(token),
    )

    assert response.status_code == 422