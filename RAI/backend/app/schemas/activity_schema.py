from pydantic import BaseModel
from typing import Optional, List


class ActivityBase(BaseModel):
    steps: int
    distance_meters: float = 0.0
    active_minutes: int = 0
    date: Optional[str] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityResponse(ActivityBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True


class ActivityHistoryPoint(BaseModel):
    label: str
    date: str
    steps: int = 0
    distance_meters: float = 0.0
    active_minutes: int = 0


class ActivityHistoryResponse(BaseModel):
    range: str
    total_steps: int
    total_distance_meters: float
    total_active_minutes: int
    points: List[ActivityHistoryPoint]