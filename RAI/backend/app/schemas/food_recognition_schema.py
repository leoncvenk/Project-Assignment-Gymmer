from pydantic import BaseModel

from app.schemas.food_schema import FoodResponseSchema


class FoodRecognitionCandidateSchema(FoodResponseSchema):
    pass


class FoodRecognitionPredictionSchema(BaseModel):
    label: str
    confidence: float
    candidates: list[FoodRecognitionCandidateSchema]


class FoodRecognitionResponseSchema(BaseModel):
    predictions: list[FoodRecognitionPredictionSchema]