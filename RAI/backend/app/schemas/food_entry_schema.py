from datetime import datetime

from pydantic import BaseModel, Field


class CreateFoodEntrySchema(BaseModel):
    food_id: str = Field(..., min_length=1)
    quantity_g: float = Field(..., gt=0)
    consumed_at: datetime | None = None


class FoodEntryResponseSchema(BaseModel):
    id: str

    user_id: str
    food_id: str

    quantity_g: float = Field(..., gt=0)

    calories: float = Field(..., ge=0)
    protein_g: float = Field(..., ge=0)
    carbs_g: float = Field(..., ge=0)
    fat_g: float = Field(..., ge=0)

    consumed_at: datetime

    created_at: datetime
    updated_at: datetime