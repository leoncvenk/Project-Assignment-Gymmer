from fastapi import Depends, HTTPException, status
from app.core.security import create_access_token, verify_password, hash_password, get_current_user_id, security
from app.models.user import User
from app.schemas.auth_schema import LoginSchema, UpdateAccountSchema
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
        return create_access_token({"sub": user.id, "email": user.email})
    
    async def get_current_user(self, user_id: str) -> User | None:
        return await self.user_service.get_user_by_id(user_id)
        
    async def change_password(self, current_user: User, current_password: str, new_password: str) -> bool:
        if not verify_password(current_password, current_user.hashed_password):
            return False
        new_hashed = hash_password(new_password)
        await self.user_service.update_password(current_user.id, new_hashed)
        return True

    async def update_authenticated_user(
        self,
        current_user: User,
        data: UpdateAccountSchema,
    ) -> User:
        updates = {}

        if data.username is not None:
            username = data.username.strip()

            if username != current_user.username:
                existing_user = await self.user_service.get_user_by_username(username)

                if existing_user is not None and existing_user.id != current_user.id:
                    raise ValueError("Username already exists")

                updates["username"] = username

        if data.email is not None and str(data.email) != current_user.email:
            existing_user = await self.user_service.get_user_by_email(str(data.email))

            if existing_user is not None and existing_user.id != current_user.id:
                raise ValueError("Email already exists")

            updates["email"] = str(data.email)

        if not updates:
            return current_user

        updated_user = await self.user_service.update_user(current_user.id, updates)

        if updated_user is None:
            raise ValueError("User no longer exists")

        return updated_user

async def get_authenticated_user(credentials=Depends(security)):
    user_id = get_current_user_id(credentials)
    auth_service = AuthService()
    user = await auth_service.get_current_user(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")
    return user