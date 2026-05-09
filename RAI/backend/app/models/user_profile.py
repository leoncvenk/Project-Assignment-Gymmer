from dataclasses import dataclass
from datetime import datetime
from typing import Literal

ActivityLevel = Literal[
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
]

GoalType = Literal[
    "lose_weight",
    "maintain_weight",
    "gain_weight",
]


@dataclass
class UserProfile:
    id: str
    user_id: str

    height_cm: float
    weight_kg: float
    goal_weight_kg: float

    activity_level: ActivityLevel
    goal_type: GoalType

    created_at: datetime
    updated_at: datetime