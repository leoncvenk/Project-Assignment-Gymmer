from dataclasses import dataclass
from datetime import datetime


@dataclass
class User:
    id: str
    username: str
    email: str
    hashed_password: str

    roles: list[str]
    profile_completed: bool

    created_at: datetime
    updated_at: datetime