import pytest
from unittest.mock import patch

from app.models.food_recognition import RecognitionPrediction
from app.services.food_recognition_service import FoodRecognitionService


@pytest.mark.asyncio
@patch('app.services.food_service.FoodService.search_foods')
@patch('app.services.food_recognition_service.FoodRecognitionService._predict_with_orv')
async def test_food_recognition_service_returns_predictions(mock_predict, mock_search_foods):
    mock_search_foods.return_value = []

    prediction = RecognitionPrediction(label="banana", confidence=0.94)
    prediction.candidates = []
        
    mock_predict.return_value = [prediction]
        
    service = FoodRecognitionService()

    predictions = await service.recognize(b"fake-image-bytes", "banana.jpg", "image/jpeg")

    assert len(predictions) == 1

    pred = predictions[0]

    assert isinstance(pred, RecognitionPrediction)
    assert pred.label == "banana"
    assert pred.confidence == 0.94