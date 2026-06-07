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
    profile_image_url: str | None = None
    profile_theme: dict | None = None
    cartoon_avatar_url: str | None = None
    use_cartoon_avatar: bool = False