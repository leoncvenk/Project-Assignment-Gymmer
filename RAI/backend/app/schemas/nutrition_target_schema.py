from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


NutritionTargetSource = Literal[
    "manual",
    "profile_estimate",
]


class CreateNutritionTargetSchema(BaseModel):
    calorie_target: int = Field(..., gt=0)

    protein_target_g: float = Field(..., ge=0)
    carbs_target_g: float = Field(..., ge=0)
    fat_target_g: float = Field(..., ge=0)

    source: NutritionTargetSource = "manual"


class UpdateNutritionTargetSchema(BaseModel):
    calorie_target: int | None = Field(default=None, gt=0)

    protein_target_g: float | None = Field(default=None, ge=0)
    carbs_target_g: float | None = Field(default=None, ge=0)
    fat_target_g: float | None = Field(default=None, ge=0)

    source: NutritionTargetSource | None = None


class NutritionTargetResponseSchema(BaseModel):
    id: str
    user_id: str

    calorie_target: int

    protein_target_g: float
    carbs_target_g: float
    fat_target_g: float

    source: NutritionTargetSource

    created_at: datetime
    updated_at: datetime