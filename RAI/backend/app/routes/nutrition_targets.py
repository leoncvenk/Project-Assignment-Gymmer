from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user_id
from app.schemas.nutrition_target_schema import (
    CreateNutritionTargetSchema,
    NutritionTargetResponseSchema,
    UpdateNutritionTargetSchema,
)
from app.services.nutrition_target_service import (
    NutritionTargetService,
)

router = APIRouter(
    prefix="/users/me/nutrition-target",
    tags=["nutrition-target"],
)

service = NutritionTargetService()


@router.get(
    "",
    response_model=NutritionTargetResponseSchema,
    summary="Get nutrition target",
    description="Returns the nutrition targets of the authenticated user.",
)
async def get_my_nutrition_target(
    current_user_id: str = Depends(get_current_user_id),
):
    target = await service.get_target_by_user_id(
        current_user_id
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition target not found",
        )

    return target


@router.put(
    "",
    response_model=NutritionTargetResponseSchema,
    summary="Create or replace nutrition target",
    description="Creates or completely replaces the nutrition targets of the authenticated user.",
)
async def create_or_replace_my_nutrition_target(
    data: CreateNutritionTargetSchema,
    current_user_id: str = Depends(get_current_user_id),
):
    return await service.create_or_replace_target(
        user_id=current_user_id,
        data=data,
    )


@router.patch(
    "",
    response_model=NutritionTargetResponseSchema,
    summary="Update nutrition target",
    description="Partially updates the nutrition targets of the authenticated user.",
)
async def update_my_nutrition_target(
    data: UpdateNutritionTargetSchema,
    current_user_id: str = Depends(get_current_user_id),
):
    target = await service.update_target(
        user_id=current_user_id,
        data=data,
    )

    if target is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nutrition target not found",
        )

    return target