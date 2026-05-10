from datetime import date

from pydantic import BaseModel, Field


class NutritionSummaryResponseSchema(BaseModel):
    date: date

    total_calories: float = Field(..., ge=0)
    total_protein_g: float = Field(..., ge=0)
    total_carbs_g: float = Field(..., ge=0)
    total_fat_g: float = Field(..., ge=0)

    entry_count: int = Field(..., ge=0)