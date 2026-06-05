from pydantic import BaseModel, ConfigDict

from app.schemas.food_schema import FoodResponseSchema


class FoodRecognitionCandidateSchema(FoodResponseSchema):
    model_config = ConfigDict(from_attributes=True)


class FoodRecognitionPredictionSchema(BaseModel):
    label: str
    confidence: float
    candidates: list[FoodRecognitionCandidateSchema]


class FoodRecognitionResponseSchema(BaseModel):
    predictions: list[FoodRecognitionPredictionSchema]