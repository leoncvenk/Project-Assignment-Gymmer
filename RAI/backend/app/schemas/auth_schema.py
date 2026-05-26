from pydantic import BaseModel, EmailStr, Field, field_validator


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


class UpdateAccountSchema(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=50)
    email: EmailStr | None = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("Username cannot be empty")

        return value