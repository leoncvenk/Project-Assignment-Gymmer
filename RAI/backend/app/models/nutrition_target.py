from dataclasses import dataclass
from datetime import datetime
from typing import Literal


NutritionTargetSource = Literal[
    "manual",
    "profile_estimate",
]


@dataclass(frozen=True)
class NutritionTarget:
    id: str
    user_id: str

    calorie_target: int
    protein_target_g: float
    carbs_target_g: float
    fat_target_g: float

    source: NutritionTargetSource = "manual"

    created_at: datetime | None = None
    updated_at: datetime | None = None