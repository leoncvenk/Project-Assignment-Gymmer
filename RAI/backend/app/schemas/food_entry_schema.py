from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

MealType = Literal[
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "unspecified",
]

class CreateFoodEntrySchema(BaseModel):
    food_id: str = Field(..., min_length=1)
    quantity_g: float = Field(..., gt=0)
    meal_type: MealType = "unspecified"
    consumed_at: datetime | None = None

class UpdateFoodEntrySchema(BaseModel):
    quantity_g: float | None = Field(default=None, gt=0)
    meal_type: MealType | None = None
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

    meal_type: MealType

    consumed_at: datetime

    created_at: datetime
    updated_at: datetime