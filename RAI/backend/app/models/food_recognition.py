from dataclasses import dataclass

from app.models.food import Food


@dataclass
class RecognitionPrediction:
    label: str
    confidence: float


@dataclass
class FoodRecognitionResult:
    label: str
    confidence: float
    candidates: list[Food]