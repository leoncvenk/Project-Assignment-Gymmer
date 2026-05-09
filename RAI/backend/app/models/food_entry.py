from dataclasses import dataclass
from datetime import datetime


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

    created_at: datetime | None = None
    updated_at: datetime | None = None