from fastapi import Depends, HTTPException, status

from app.core.security import create_access_token, verify_password, get_current_user_id, security
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
    
    async def get_current_user(
            self,
            user_id: str,
    ) -> User | None:
        return await self.user_service.get_user_by_id(user_id)
    

async def get_authenticated_user(
        credentials=Depends(security)
):
    user_id = get_current_user_id(credentials)

    auth_service = AuthService()

    user = await auth_service.get_current_user(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
        )
    
    return user