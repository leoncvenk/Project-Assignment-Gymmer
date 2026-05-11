import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from uuid import uuid4

from app.core.database import get_db
from app.main import app
from app.services.user_profile_service import USER_PROFILES_COLLECTION
from app.services.user_service import USERS_COLLECTION
from app.services.nutrition_target_service import NUTRITION_TARGETS_COLLECTION

def unique_email() -> str:
    return f"test-{uuid4().hex}@example.com"

@pytest_asyncio.fixture
async def client():
    async with LifespanManager(app):
        db = get_db()
        await db[USER_PROFILES_COLLECTION].delete_many({})
        await db[USERS_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})

        transport = ASGITransport(app=app)

        async with AsyncClient(
            transport=transport,
            base_url="http://test",
        ) as test_client:
            yield test_client

        await db[USER_PROFILES_COLLECTION].delete_many({})
        await db[USERS_COLLECTION].delete_many({})
        await db[NUTRITION_TARGETS_COLLECTION].delete_many({})


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


def valid_profile_payload() -> dict:
    return {
        "height_cm": 180,
        "weight_kg": 85,
        "goal_weight_kg": 79,
        "age": 22,
        "sex": "male",
        "activity_level": "moderate",
        "goal_type": "lose_weight",
    }


@pytest.mark.asyncio
async def test_get_profile_without_profile_returns_404(client):
    token = await register_and_login(client)

    response = await client.get(
        "/users/me/profile",
        headers=auth_headers(token),
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_put_profile_creates_profile(client):
    token = await register_and_login(client)

    response = await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] is not None
    assert data["height_cm"] == 180
    assert data["weight_kg"] == 85
    assert data["goal_weight_kg"] == 79
    assert data["activity_level"] == "moderate"
    assert data["goal_type"] == "lose_weight"
    assert data["age"] == 22
    assert data["sex"] == "male"


@pytest.mark.asyncio
async def test_get_profile_after_put_returns_profile(client):
    token = await register_and_login(client)

    create = await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    response = await client.get(
        "/users/me/profile",
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == create.json()["id"]
    assert data["height_cm"] == 180
    assert data["weight_kg"] == 85
    assert data["goal_weight_kg"] == 79
    assert data["activity_level"] == "moderate"
    assert data["goal_type"] == "lose_weight"
    assert data["age"] == 22
    assert data["sex"] == "male"


@pytest.mark.asyncio
async def test_patch_profile_updates_partial_fields(client):
    token = await register_and_login(client)

    create = await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    response = await client.patch(
        "/users/me/profile",
        json={
            "weight_kg": 83,
            "activity_level": "active",
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == create.json()["id"]
    assert data["height_cm"] == 180
    assert data["weight_kg"] == 83
    assert data["goal_weight_kg"] == 79
    assert data["activity_level"] == "active"
    assert data["goal_type"] == "lose_weight"
    assert data["age"] == 22
    assert data["sex"] == "male"


@pytest.mark.asyncio
async def test_profile_requires_authentication(client):
    response = await client.get("/users/me/profile")

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_put_profile_marks_auth_me_profile_completed_true(client):
    token = await register_and_login(client)

    before = await client.get(
        "/auth/me",
        headers=auth_headers(token),
    )

    assert before.status_code == 200
    assert before.json()["profile_completed"] is False

    response = await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    after = await client.get(
        "/auth/me",
        headers=auth_headers(token),
    )

    assert after.status_code == 200
    assert after.json()["profile_completed"] is True


@pytest.mark.asyncio
async def test_patch_profile_updates_age_and_sex(client):
    token = await register_and_login(client)

    await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    response = await client.patch(
        "/users/me/profile",
        json={
            "age": 23,
            "sex": "female",
        },
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    data = response.json()
    assert data["age"] == 23
    assert data["sex"] == "female"

@pytest.mark.asyncio
async def test_put_profile_auto_creates_nutrition_target(client):
    token = await register_and_login(client)

    response = await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    target_response = await client.get(
        "/users/me/nutrition-target",
        headers=auth_headers(token),
    )

    assert target_response.status_code == 200

    target = target_response.json()

    assert target["source"] == "profile_estimate"
    assert target["calorie_target"] == 2498
    assert target["protein_target_g"] == 170
    assert target["fat_target_g"] == 68
    assert target["carbs_target_g"] == 301.5

@pytest.mark.asyncio
async def test_put_profile_makes_dashboard_show_nutrition_target(client):
    token = await register_and_login(client)

    response = await client.put(
        "/users/me/profile",
        json=valid_profile_payload(),
        headers=auth_headers(token),
    )

    assert response.status_code == 200

    dashboard_response = await client.get(
        "/users/me/dashboard?date=2026-05-10",
        headers=auth_headers(token),
    )

    assert dashboard_response.status_code == 200

    dashboard = dashboard_response.json()

    assert dashboard["profile_completed"] is True
    assert dashboard["has_nutrition_target"] is True

    assert dashboard["targets"]["calorie_target"] == 2498
    assert dashboard["targets"]["protein_target_g"] == 170
    assert dashboard["targets"]["fat_target_g"] == 68
    assert dashboard["targets"]["carbs_target_g"] == 301.5