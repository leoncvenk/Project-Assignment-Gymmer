from dataclasses import dataclass
from datetime import datetime
from typing import Literal

FoodSource = Literal["manual", "open_food_facts", "internal"]


@dataclass(frozen=True)
class Food:
    id: str
    name: str

    brand: str | None = None
    barcode: str | None = None
    category: str | None = None

    source: FoodSource = "manual"
    source_id: str | None = None
    image_url: str | None = None

    is_verified: bool = False

    created_at: datetime | None = None
    updated_at: datetime | None = None