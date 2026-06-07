from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File

from app.schemas.auth_schema import LoginSchema, TokenSchema, ChangePasswordSchema, UpdateAccountSchema
from app.schemas.user_schema import CreateUserSchema, UserResponseSchema
from app.services.auth_service import AuthService
from app.models.user import User
from app.services.auth_service import AuthService, get_authenticated_user
from app.services.profile_theme_service import generate_profile_theme_for_image
from app.services.cartoon_avatar_service import generate_cartoon_avatar_for_image

router = APIRouter(prefix="/auth", tags=["auth"])

auth_service = AuthService()


ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml"}
MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024
PROFILE_IMAGE_DIR = Path("uploads/profile-images")
PROFILE_IMAGE_DIR.mkdir(parents=True, exist_ok=True)


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

@router.patch(
    "/me",
    response_model=UserResponseSchema,
    summary="Update current authenticated user",
    description="Updates editable account fields for the currently authenticated user.",
)
async def update_me(
    data: UpdateAccountSchema,
    current_user: User = Depends(get_authenticated_user),
):
    try:
        updated_user = await auth_service.update_authenticated_user(
            current_user,
            data,
        )

        return updated_user

    except ValueError as e:
        if str(e) in ["Username already exists", "Email already exists"]:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(e),
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

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

@router.post(
    "/me/profile-image",
    response_model=UserResponseSchema,
    summary="Upload current user's profile image",
    description="Uploads and saves a profile image URL for the currently authenticated user.",
)
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_authenticated_user),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only SVG, PNG, JPG and GIF images are allowed.",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_PROFILE_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile image must be smaller than 2 MB.",
        )

    extension = Path(file.filename or "profile-image").suffix.lower()
    if extension not in {".svg", ".png", ".jpg", ".jpeg", ".gif"}:
        extension = ".jpg"

    filename = f"{current_user.id}-{uuid4().hex}{extension}"
    file_path = PROFILE_IMAGE_DIR / filename
    file_path.write_bytes(file_bytes)

    profile_image_url = f"/uploads/profile-images/{filename}"

    try:
        profile_theme = generate_profile_theme_for_image(file_path)
    except Exception as error:
        print(f"Profile theme generation failed: {error}")
        profile_theme = None

    updated_user = await auth_service.user_service.update_user(
        current_user.id,
        {
            "profile_image_url": profile_image_url,
            "profile_theme": profile_theme,
        },
    )

    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return updated_user

@router.post(
    "/me/cartoon-avatar",
    response_model=UserResponseSchema,
    summary="Generate current user's cartoon avatar",
    description="Generates a cartoon avatar from the current user's profile image.",
)
async def generate_cartoon_avatar(
    current_user: User = Depends(get_authenticated_user),
):
    if not current_user.profile_image_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a profile image before generating a cartoon avatar.",
        )

    relative_image_path = current_user.profile_image_url.lstrip("/")
    image_path = Path(relative_image_path)

    if not image_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile image file was not found on the server.",
        )

    try:
        cartoon_avatar_url = generate_cartoon_avatar_for_image(image_path)
    except Exception as error:
        print(f"Cartoon avatar generation failed: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cartoon avatar generation failed.",
        )

    updated_user = await auth_service.user_service.update_user(
        current_user.id,
        {
            "cartoon_avatar_url": cartoon_avatar_url,
        },
    )

    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return updated_user