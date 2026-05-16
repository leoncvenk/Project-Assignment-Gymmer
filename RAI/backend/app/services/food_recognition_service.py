from app.models.food_recognition import RecognitionPrediction


class FoodRecognitionService:
    async def recognize(self, image_bytes: bytes) -> list[RecognitionPrediction]:
        return [
            RecognitionPrediction(
                label="banana",
                confidence=0.94,
            )
        ]