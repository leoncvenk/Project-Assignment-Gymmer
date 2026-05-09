from fastapi import APIRouter, HTTPException, status

from app.schemas.auth_schema import LoginSchema, TokenSchema
from app.schemas.user_schema import CreateUserSchema, UserResponseSchema
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()


@router.post(
    "/register",
    response_model=UserResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def register(data: CreateUserSchema):
    user = await auth_service.register(data)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return user


@router.post("/login", response_model=TokenSchema)
async def login(data: LoginSchema):
    user = await auth_service.authenticate_user(data)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = auth_service.create_token_for_user(user)

    return {
        "access_token": token,
        "token_type": "bearer",
    }