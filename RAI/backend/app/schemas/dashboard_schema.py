from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

MealType = Literal[
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "unspecified",
]

class DashboardSummarySchema(BaseModel):
    total_calories: float = Field(..., ge=0)
    total_protein_g: float = Field(..., ge=0)
    total_carbs_g: float = Field(..., ge=0)
    total_fat_g: float = Field(..., ge=0)

    entry_count: int = Field(..., ge=0)


class DashboardTargetsSchema(BaseModel):
    calorie_target: int | None = Field(default=None, gt=0)

    protein_target_g: float | None = Field(default=None, ge=0)
    carbs_target_g: float | None = Field(default=None, ge=0)
    fat_target_g: float | None = Field(default=None, ge=0)


class DashboardRemainingSchema(BaseModel):
    calories: float | None = None

    protein_g: float | None = None
    carbs_g: float | None = None
    fat_g: float | None = None


class DashboardProgressSchema(BaseModel):
    calories_percent: float | None = Field(default=None, ge=0)

    protein_percent: float | None = Field(default=None, ge=0)
    carbs_percent: float | None = Field(default=None, ge=0)
    fat_percent: float | None = Field(default=None, ge=0)


class DashboardEntrySchema(BaseModel):
    id: str
    food_id: str

    quantity_g: float = Field(..., gt=0)

    calories: float = Field(..., ge=0)
    protein_g: float = Field(..., ge=0)
    carbs_g: float = Field(..., ge=0)
    fat_g: float = Field(..., ge=0)

    meal_type: MealType

    consumed_at: datetime


class DashboardResponseSchema(BaseModel):
    date: date

    profile_completed: bool
    has_nutrition_target: bool

    summary: DashboardSummarySchema
    targets: DashboardTargetsSchema | None
    remaining: DashboardRemainingSchema | None
    progress: DashboardProgressSchema | None

    entries: list[DashboardEntrySchema]