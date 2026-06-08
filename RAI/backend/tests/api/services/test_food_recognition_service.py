import pytest
from unittest.mock import patch

from app.models.food_recognition import RecognitionPrediction
from app.services.food_recognition_service import FoodRecognitionService


@pytest.mark.asyncio
@patch('app.services.food_recognition_service.FoodRecognitionService._predict_with_orv')
async def test_food_recognition_service_returns_predictions(mock_predict):
    # Mock the internal HTTP-calling method to avoid real network requests
    mock_recognize.return_value = [
        RecognitionPrediction(label="banana", confidence=0.94)
    ]
    
    service = FoodRecognitionService()

    # Pass the missing positional arguments to fix the TypeError
    predictions = await service.recognize(b"fake-image-bytes", "banana.jpg", "image/jpeg")

    assert len(predictions) == 1

    prediction = predictions[0]

    assert isinstance(prediction, RecognitionPrediction)
    assert prediction.label == "banana"
    assert prediction.confidence == 0.94