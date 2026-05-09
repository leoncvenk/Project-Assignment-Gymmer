from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


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


class UserProfileBaseSchema(BaseModel):
    height_cm: float = Field(gt=0, le=300)
    weight_kg: float = Field(gt=0, le=1000)
    goal_weight_kg: float = Field(gt=0, le=1000)

    activity_level: ActivityLevel
    goal_type: GoalType


class CreateUserProfileSchema(UserProfileBaseSchema):
    pass


class UpdateUserProfileSchema(BaseModel):
    height_cm: float | None = Field(default=None, gt=0, le=300)
    weight_kg: float | None = Field(default=None, gt=0, le=1000)
    goal_weight_kg: float | None = Field(default=None, gt=0, le=1000)

    activity_level: ActivityLevel | None = None
    goal_type: GoalType | None = None


class UserProfileResponseSchema(UserProfileBaseSchema):
    id: str
    user_id: str

    created_at: datetime
    updated_at: datetime