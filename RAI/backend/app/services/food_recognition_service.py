import httpx

from app.core.config import settings
from app.models.food_recognition import FoodRecognitionResult, RecognitionPrediction
from app.services.food_service import FoodService


class FoodRecognitionService:
    def __init__(self):
        self.food_service = FoodService()

    async def recognize(
        self,
        image_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> list[FoodRecognitionResult]:
        predictions = await self._predict_with_orv(
            image_bytes=image_bytes,
            filename=filename,
            content_type=content_type,
        )

        results = []

        for prediction in predictions:
            candidates = await self.food_service.search_foods(
                query=prediction.label,
                limit=10,
                skip=0,
            )

            results.append(
                FoodRecognitionResult(
                    label=prediction.label,
                    confidence=prediction.confidence,
                    candidates=candidates,
                )
            )

        return results

    async def _predict_with_orv(
        self,
        image_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> list[RecognitionPrediction]:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{settings.ORV_API_URL}/predict/food",
                files={
                    "file": (
                        filename,
                        image_bytes,
                        content_type,
                    )
                },
            )

        response.raise_for_status()
        data = response.json()

        return self._parse_orv_response(data)

    def _parse_orv_response(self, data: dict) -> list[RecognitionPrediction]:
        found = data.get("found", [])

        best_by_label: dict[str, RecognitionPrediction] = {}

        for item in found:
            label = item.get("food")
            confidence = item.get("confidence")

            if label is None or confidence is None:
                continue

            label = label.strip().lower()
            confidence = float(confidence)

            existing = best_by_label.get(label)

            if existing is None or confidence > existing.confidence:
                best_by_label[label] = RecognitionPrediction(
                    label=label,
                    confidence=confidence,
                )

        return sorted(
            best_by_label.values(),
            key=lambda prediction: prediction.confidence,
            reverse=True,
        )