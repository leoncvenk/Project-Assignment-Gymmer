from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field

FoodSource = Literal["manual", "open_food_facts", "internal"]

class CreateFoodSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)

    brand: Optional[str] = Field(default=None, max_length=255)
    barcode: Optional[str] = Field(default=None, max_length=64)
    category: Optional[str] = Field(default=None, max_length=100)

    source: FoodSource = "manual"
    source_id: Optional[str] = Field(default=None, max_length=255)

    image_url: Optional[str] = None
    is_verified: bool = False


class UpdateFoodSchema(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)

    brand: Optional[str] = Field(default="Unknown", max_length=255)
    barcode: Optional[str] = Field(default=None, max_length=64)
    category: Optional[str] = Field(default=None, max_length=100)

    source: Optional[FoodSource] = None
    source_id: Optional[str] = Field(default=None, max_length=255)

    image_url: Optional[str] = None
    is_verified: Optional[bool] = None

class FoodResponseSchema(BaseModel):
    id: str

    name: str
    brand: Optional[str]

    barcode: Optional[str]
    category: Optional[str]

    source: FoodSource
    source_id: Optional[str]

    image_url: Optional[str]
    is_verified: bool

    created_at: datetime
    updated_at: datetime