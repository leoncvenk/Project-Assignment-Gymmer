from datetime import date

from fastapi import APIRouter, Depends, Query

from app.core.security import get_current_user_id
from app.schemas.dashboard_schema import (
    DashboardResponseSchema,
)
from app.services.dashboard_service import (
    DashboardService,
)

router = APIRouter(
    prefix="/users/me/dashboard",
    tags=["dashboard"],
)

service = DashboardService()


@router.get(
    "",
    response_model=DashboardResponseSchema,
    summary="Get dashboard data",
    description="Returns aggregated dashboard data for the authenticated user including nutrition summary, targets, remaining macros, progress percentages and daily food entries.",
)
async def get_my_dashboard(
    date_value: date = Query(
        ...,
        alias="date",
        description="Date to build dashboard data for (YYYY-MM-DD).",
    ),
    current_user_id: str = Depends(get_current_user_id),
):
    return await service.get_dashboard(
        user_id=current_user_id,
        dashboard_date=date_value,
    )