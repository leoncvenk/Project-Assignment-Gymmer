from fastapi import APIRouter, HTTPException, status, Depends

from app.schemas.auth_schema import LoginSchema, TokenSchema, ChangePasswordSchema
from app.schemas.user_schema import CreateUserSchema, UserResponseSchema
from app.services.auth_service import AuthService
from app.models.user import User
from app.services.auth_service import AuthService, get_authenticated_user

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()


@router.post(
    "/register",
    response_model=UserResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Creates a new user account using username, email, and password.",
)
async def register(data: CreateUserSchema):
    user = await auth_service.register(data)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    return user


@router.post(
    "/login",
    response_model=TokenSchema,
    summary="Authenticate user",
    description="Authenticates a user and returns a JWT access token for authenticated requests.",
)
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

@router.get(
    "/me",
    response_model=UserResponseSchema,
    summary="Get current authenticated user",
    description="Returns the currently authenticated user's account information.",
)
async def get_me(current_user: User = Depends(get_authenticated_user)):
    return current_user

@router.put(
    "/change-password",
    summary="Change user password",
    description="Updates the password for the currently authenticated user.",
)
async def change_password(
    data: ChangePasswordSchema,
    current_user: User = Depends(get_authenticated_user)
):
    success = await auth_service.change_password(current_user, data.current_password, data.new_password)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )

    return {"detail": "Password updated successfully"}