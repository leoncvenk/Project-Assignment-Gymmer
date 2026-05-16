import pytest

from app.models.food_recognition import RecognitionPrediction
from app.services.food_recognition_service import FoodRecognitionService


@pytest.mark.asyncio
async def test_food_recognition_service_returns_predictions():
    service = FoodRecognitionService()

    predictions = await service.recognize(b"fake-image-bytes")

    assert len(predictions) == 1

    prediction = predictions[0]

    assert isinstance(prediction, RecognitionPrediction)
    assert prediction.label == "banana"
    assert prediction.confidence == 0.94