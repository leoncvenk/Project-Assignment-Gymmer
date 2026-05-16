from fastapi import APIRouter, File, UploadFile

from app.schemas.food_recognition_schema import (
    FoodRecognitionPredictionSchema,
    FoodRecognitionResponseSchema,
)
from app.services.food_recognition_service import FoodRecognitionService

router = APIRouter(prefix="/users/me", tags=["food-recognition"])

service = FoodRecognitionService()


@router.post(
    "/food-recognition",
    response_model=FoodRecognitionResponseSchema,
)
async def recognize_foods(image: UploadFile = File(...)):
    image_bytes = await image.read()

    predictions = await service.recognize(image_bytes)

    return FoodRecognitionResponseSchema(
        predictions=[
            FoodRecognitionPredictionSchema(
                label=prediction.label,
                confidence=prediction.confidence,
                candidates=[],
            )
            for prediction in predictions
        ]
    )