from fastapi import APIRouter, Depends, HTTPException, status

from app.models.user import User
from app.schemas.user_profile_schema import (
    CreateUserProfileSchema,
    UpdateUserProfileSchema,
    UserProfileResponseSchema,
)
from app.services.auth_service import get_authenticated_user
from app.services.user_profile_service import UserProfileService

router = APIRouter(prefix="/users/me/profile", tags=["user-profile"])

profile_service = UserProfileService()


@router.get("", response_model=UserProfileResponseSchema)
async def get_my_profile(
    current_user: User = Depends(get_authenticated_user),
):
    profile = await profile_service.get_profile_by_user_id(current_user.id)

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return profile


@router.put("", response_model=UserProfileResponseSchema)
async def create_or_replace_my_profile(
    data: CreateUserProfileSchema,
    current_user: User = Depends(get_authenticated_user),
):
    return await profile_service.create_or_replace_profile(
        user_id=current_user.id,
        data=data,
    )


@router.patch("", response_model=UserProfileResponseSchema)
async def update_my_profile(
    data: UpdateUserProfileSchema,
    current_user: User = Depends(get_authenticated_user),
):
    profile = await profile_service.update_profile(
        user_id=current_user.id,
        data=data,
    )

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return profile