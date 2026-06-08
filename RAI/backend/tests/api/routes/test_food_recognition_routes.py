import pytest
from unittest.mock import patch

from tests.api.conftest import auth_headers, register_and_login
from app.models.food_recognition import RecognitionPrediction


@pytest.mark.asyncio
@patch('app.services.food_recognition_service.FoodRecognitionService.recognize')
async def test_food_recognition_upload_endpoint_returns_predictions(mock_recognize, client):
    prediction = RecognitionPrediction(label="banana", confidence=0.94)
    prediction.candidates = []
        
    mock_recognize.return_value = [prediction]
    
    token = await register_and_login(client)
    
    response = await client.post(
        "/users/me/food-recognition",
        headers=auth_headers(token),
        files={
            "image": ("banana.jpg", b"fake-image-bytes", "image/jpeg"),
        },
    )
        
    assert response.status_code == 200.

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