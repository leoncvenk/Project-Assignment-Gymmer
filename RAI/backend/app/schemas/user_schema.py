from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class CreateUserSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("username", "email", mode="before")
    @classmethod
    def strip_strings(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class UserResponseSchema(BaseModel):
    id: str
    username: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime