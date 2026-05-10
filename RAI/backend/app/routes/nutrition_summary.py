from datetime import date

from fastapi import APIRouter, Depends, Query

from app.core.security import get_current_user_id
from app.schemas.nutrition_summary_schema import (
    NutritionSummaryResponseSchema,
)
from app.services.nutrition_summary_service import (
    NutritionSummaryService,
)

router = APIRouter()

service = NutritionSummaryService()


@router.get(
    "/users/me/nutrition-summary",
    response_model=NutritionSummaryResponseSchema,
    summary="Get daily nutrition summary",
    description="Returns aggregated calories and macros for the authenticated user for a specific date.",
)
async def get_my_nutrition_summary(
    date_value: date = Query(
        ...,
        alias="date",
        description="Date to aggregate nutrition data for (YYYY-MM-DD).",
    ),
    current_user_id: str = Depends(get_current_user_id),
):
    return await service.get_daily_summary(
        user_id=current_user_id,
        summary_date=date_value,
    )