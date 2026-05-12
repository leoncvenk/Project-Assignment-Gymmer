from datetime import date

from fastapi import APIRouter, Depends, Query

from app.core.security import get_current_user_id
from app.schemas.dashboard_schema import (
    DashboardResponseSchema,
    WeeklyDashboardResponseSchema
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

@router.get(
    "/weekly",
    response_model=WeeklyDashboardResponseSchema,
    summary="Get weekly dashboard data",
    description="Returns Monday-to-Sunday dashboard summary data for the week containing the provided date.",
)
async def get_my_weekly_dashboard(
    date_value: date = Query(
        ...,
        alias="date",
        description="Any date within the target week (YYYY-MM-DD).",
    ),
    current_user_id: str = Depends(get_current_user_id),
):
    return await service.get_weekly_dashboard(
        user_id=current_user_id,
        target_date=date_value,
    )