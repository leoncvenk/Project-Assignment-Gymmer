from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_update_food_partial():
    create = client.post("/foods", json={"name": "Apple"})
    food_id = create.json()["id"]

    response = client.patch(
        f"/foods/{food_id}",
        json={"name": "Green Apple"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Green Apple"

def test_update_food_does_not_override_other_fields():
    create = client.post(
        "/foods",
        json={"name": "Milk", "brand": "Alpsko"}
    )
    food_id = create.json()["id"]

    client.patch(
        f"/foods/{food_id}",
        json={"name": "Updated Milk"}
    )

    response = client.get(f"/foods/{food_id}")

    assert response.json()["brand"] == "Alpsko"

def test_update_food_invalid():
    create = client.post("/foods", json={"name": "Rice"})
    food_id = create.json()["id"]

    response = client.patch(
        f"/foods/{food_id}",
        json={"name": ""}
    )

    assert response.status_code == 422

def test_update_food_not_found():
    response = client.patch(
        "/foods/nonexistent",
        json={"name": "Ghost Food"}
    )

    assert response.status_code == 404