from dataclasses import dataclass
from datetime import datetime
from typing import Literal

@dataclass(frozen=True)
class FoodEntry:
    id: str

    user_id: str
    food_id: str

    quantity_g: float

    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float


    consumed_at: datetime
    
    meal_type: Literal[
        "breakfast",
        "lunch",
        "dinner",
        "snack",
        "unspecified",
    ] = "unspecified"

    created_at: datetime | None = None
    updated_at: datetime | None = None