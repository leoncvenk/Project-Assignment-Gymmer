from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user_id
from app.schemas.food_entry_schema import CreateFoodEntrySchema, FoodEntryResponseSchema
from app.services.food_entry_service import FoodEntryService

router = APIRouter()
service = FoodEntryService()


@router.post(
    "/users/me/food-entries",
    response_model=FoodEntryResponseSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create food entry",
    description="Creates a food consumption entry for the authenticated user and snapshots nutrition values at creation time.",
)
async def create_food_entry(
    data: CreateFoodEntrySchema,
    current_user_id: str = Depends(get_current_user_id),
):
    entry = await service.create_entry(
        user_id=current_user_id,
        data=data,
    )

    if entry is None:
        raise HTTPException(status_code=404, detail="Food not found")

    return entry


@router.get(
    "/users/me/food-entries",
    response_model=list[FoodEntryResponseSchema],
    summary="Get food entries",
    description="Returns all food entries belonging to the authenticated user ordered by consumption time.",
)
async def get_my_food_entries(
    current_user_id: str = Depends(get_current_user_id),
):
    return await service.get_entries_for_user(current_user_id)


@router.get(
    "/users/me/food-entries/{entry_id}",
    response_model=FoodEntryResponseSchema,
    summary="Get food entry by id",
    description="Returns a specific food entry belonging to the authenticated user.",
)
async def get_my_food_entry(
    entry_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    entry = await service.get_entry_by_id(
        entry_id=entry_id,
        user_id=current_user_id,
    )

    if entry is None:
        raise HTTPException(status_code=404, detail="Food entry not found")

    return entry


@router.delete(
    "/users/me/food-entries/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete food entry",
    description="Deletes a food entry belonging to the authenticated user.",
)
async def delete_my_food_entry(
    entry_id: str,
    current_user_id: str = Depends(get_current_user_id),
):
    deleted = await service.delete_entry(
        entry_id=entry_id,
        user_id=current_user_id,
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Food entry not found")