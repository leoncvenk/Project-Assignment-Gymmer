from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.schemas.auth_schema import LoginSchema
from app.schemas.user_schema import CreateUserSchema
from app.services.user_service import UserService


class AuthService:
    def __init__(self):
        self.user_service = UserService()

    async def register(self, data: CreateUserSchema) -> User | None:
        return await self.user_service.create_user(data)

    async def authenticate_user(self, data: LoginSchema) -> User | None:
        user = await self.user_service.get_user_by_email(data.email)

        if user is None:
            return None

        if not verify_password(data.password, user.hashed_password):
            return None

        return user

    def create_token_for_user(self, user: User) -> str:
        return create_access_token(
            {
                "sub": user.id,
                "email": user.email,
            }
        )