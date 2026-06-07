from dataclasses import dataclass
from datetime import date

@dataclass
class Activity:
    id: str
    user_id: str
    date: date
    steps: int = 0
    distance_meters: float = 0.0
    active_minutes: int = 0