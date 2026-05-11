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

Sex = Literal["male", "female"]


class UserProfileBaseSchema(BaseModel):
    height_cm: float = Field(gt=0, le=300)
    weight_kg: float = Field(gt=0, le=1000)
    goal_weight_kg: float = Field(gt=0, le=1000)

    age: int = Field(ge=13, le=120)
    sex: Sex

    activity_level: ActivityLevel
    goal_type: GoalType


class CreateUserProfileSchema(UserProfileBaseSchema):
    pass


class UpdateUserProfileSchema(BaseModel):
    height_cm: float | None = Field(default=None, gt=0, le=300)
    weight_kg: float | None = Field(default=None, gt=0, le=1000)
    goal_weight_kg: float | None = Field(default=None, gt=0, le=1000)

    age: int | None = Field(default=None, ge=13, le=120)
    sex: Sex | None = None

    activity_level: ActivityLevel | None = None
    goal_type: GoalType | None = None


class UserProfileResponseSchema(UserProfileBaseSchema):
    id: str
    user_id: str

    age: int | None
    sex: Sex | None

    created_at: datetime
    updated_at: datetime