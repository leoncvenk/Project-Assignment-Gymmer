from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

FoodSource = Literal["manual", "open_food_facts", "internal"]


class CreateFoodSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

    brand: str | None = Field(default=None, max_length=255)
    barcode: str | None = Field(default=None, max_length=64)
    category: str | None = Field(default=None, max_length=100)

    calories_per_100g: float | None = Field(default=None, ge=0)

    protein_g_per_100g: float | None = Field(default=None, ge=0)
    carbs_g_per_100g: float | None = Field(default=None, ge=0)
    fat_g_per_100g: float | None = Field(default=None, ge=0)

    fiber_g_per_100g: float | None = Field(default=None, ge=0)
    sugar_g_per_100g: float | None = Field(default=None, ge=0)
    salt_g_per_100g: float | None = Field(default=None, ge=0)

    source: FoodSource = "manual"
    source_id: str | None = Field(default=None, max_length=255)

    image_url: str | None = None
    is_verified: bool = False

    @field_validator(
        "name",
        "brand",
        "barcode",
        "category",
        "source_id",
        mode="before",
    )
    @classmethod
    def strip_strings(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class UpdateFoodSchema(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)

    brand: str | None = Field(default=None, max_length=255)
    barcode: str | None = Field(default=None, max_length=64)
    category: str | None = Field(default=None, max_length=100)

    calories_per_100g: float | None = Field(default=None, ge=0)

    protein_g_per_100g: float | None = Field(default=None, ge=0)
    carbs_g_per_100g: float | None = Field(default=None, ge=0)
    fat_g_per_100g: float | None = Field(default=None, ge=0)

    fiber_g_per_100g: float | None = Field(default=None, ge=0)
    sugar_g_per_100g: float | None = Field(default=None, ge=0)
    salt_g_per_100g: float | None = Field(default=None, ge=0)

    source: FoodSource | None = None
    source_id: str | None = Field(default=None, max_length=255)

    image_url: str | None = None
    is_verified: bool | None = None

    @field_validator(
        "name",
        "brand",
        "barcode",
        "category",
        "source_id",
        mode="before",
    )
    @classmethod
    def strip_strings(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class FoodResponseSchema(BaseModel):
    id: str
    name: str

    brand: str | None
    barcode: str | None
    category: str | None

    calories_per_100g: float | None

    protein_g_per_100g: float | None
    carbs_g_per_100g: float | None
    fat_g_per_100g: float | None

    fiber_g_per_100g: float | None
    sugar_g_per_100g: float | None
    salt_g_per_100g: float | None

    source: FoodSource
    source_id: str | None
    image_url: str | None

    is_verified: bool

    created_at: datetime
    updated_at: datetime

class FoodSearchQuerySchema(BaseModel):
    query: str = Field(..., min_length=1, max_length=100)

    @field_validator("query")
    @classmethod
    def strip_query(cls, value: str) -> str:
        return value.strip()