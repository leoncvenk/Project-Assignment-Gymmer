from pydantic import BaseModel
from typing import Optional

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