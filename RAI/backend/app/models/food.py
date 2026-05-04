from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Literal

FoodSource = Literal["manual", "open_food_facts", "internal"]

@dataclass(frozen=True)
class Food:
    id: str

    name: str
    brand: Optional[str] = None

    barcode: Optional[str] = None

    category: Optional[str] = None

    source: FoodSource = "manual"
    source_id: Optional[str] = None

    image_url: Optional[str] = None

    is_verified: bool = False

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None