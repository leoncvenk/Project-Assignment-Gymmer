from fastapi import APIRouter, Depends, File, UploadFile

from app.schemas.food_recognition_schema import (
    FoodRecognitionCandidateSchema,
    FoodRecognitionPredictionSchema,
    FoodRecognitionResponseSchema
)
from app.services.food_recognition_service import FoodRecognitionService
from app.core.security import get_current_user_id

router = APIRouter(prefix="/users/me", tags=["food-recognition"])

service = FoodRecognitionService()


@router.post(
    "/food-recognition",
    response_model=FoodRecognitionResponseSchema,
)
async def recognize_foods(
    image: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user_id),
):
    image_bytes = await image.read()

    results = await service.recognize(
        image_bytes=image_bytes,
        filename=image.filename or "image.jpg",
        content_type=image.content_type or "image/jpeg",
    )

    return FoodRecognitionResponseSchema(
        predictions=[
            FoodRecognitionPredictionSchema(
                label=result.label,
                confidence=result.confidence,
                candidates=[
                    FoodRecognitionCandidateSchema.model_validate(
                        candidate,
                        from_attributes=True,
                    )
                    for candidate in result.candidates
                ],
            )
            for result in results
        ]
    )