from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_food_route():
    response = client.post(
        "/foods",
        json={"name": "Banana"}
    )

    assert response.status_code in [200, 201]

    data = response.json()
    assert data["name"] == "Banana"
    assert data["brand"] == None

def test_create_food_invalid():
    response = client.post(
        "/foods",
        json={"name": ""}
    )

    assert response.status_code == 422

def test_get_food_by_id():
    create = client.post("/foods", json={"name": "Apple"})
    food_id = create.json()["id"]

    response = client.get(f"/foods/{food_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Apple"

def test_get_food_not_found():
    response = client.get("/foods/nonexistent")

    assert response.status_code == 404

def test_create_food_duplicate_barcode_route():
    first = client.post(
        "/foods",
        json={"name": "Milk", "barcode": "123"}
    )

    second = client.post(
        "/foods",
        json={"name": "Different Milk", "barcode": "123"}
    )

    assert first.json()["id"] == second.json()["id"]