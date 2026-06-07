from fastapi import APIRouter, Depends

from app.services.auth_service import get_authenticated_user
from app.models.user import User
from app.schemas.activity_schema import (
    ActivityCreate,
    ActivityResponse,
    ActivityHistoryResponse,
)
from app.services.activity_service import ActivityService


router = APIRouter(prefix="/users/me/activity", tags=["Activity"])
activity_service = ActivityService()


@router.post("/", response_model=ActivityResponse)
async def sync_activity(
    activity_in: ActivityCreate,
    current_user: User = Depends(get_authenticated_user)
):
    return await activity_service.sync_daily_activity(
        user_id=current_user.id,
        activity_data=activity_in
    )


@router.get("/", response_model=ActivityResponse)
async def get_activity(current_user: User = Depends(get_authenticated_user)):
    activity = await activity_service.get_daily_activity(current_user.id)

    if not activity:
        return {
            "id": "0",
            "user_id": current_user.id,
            "steps": 0,
            "distance_meters": 0.0,
            "active_minutes": 0,
            "date": None
        }

    activity["id"] = str(activity.get("id", activity.get("_id")))

    return activity


@router.get("/history", response_model=ActivityHistoryResponse)
async def get_activity_history(
    range: str = "7d",
    current_user: User = Depends(get_authenticated_user)
):
    return await activity_service.get_activity_history(
        user_id=current_user.id,
        range_name=range
    )