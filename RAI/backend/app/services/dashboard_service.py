from datetime import date, timedelta

from app.schemas.dashboard_schema import (
    DashboardEntrySchema,
    DashboardProgressSchema,
    DashboardRemainingSchema,
    DashboardResponseSchema,
    DashboardSummarySchema,
    DashboardTargetsSchema,
    DashboardMealSchema,
    WeeklyDashboardDaySchema,
    WeeklyDashboardResponseSchema,
)
from app.services.food_entry_service import (
    FoodEntryService,
)
from app.services.nutrition_summary_service import (
    NutritionSummaryService,
)
from app.services.nutrition_target_service import (
    NutritionTargetService,
)
from app.services.user_service import UserService

MEAL_ORDER = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "unspecified",
]


class DashboardService:
    def __init__(self):
        self.user_service = UserService()

        self.food_entry_service = FoodEntryService()

        self.summary_service = NutritionSummaryService()

        self.target_service = NutritionTargetService()

    async def get_dashboard(
        self,
        user_id: str,
        dashboard_date: date,
    ) -> DashboardResponseSchema:
        user = await self.user_service.get_user_by_id(user_id)

        summary = await self.summary_service.get_daily_summary(
            user_id=user_id,
            summary_date=dashboard_date,
        )

        target = await self.target_service.get_target_by_user_id(
            user_id,
        )

        entries = await self.food_entry_service.get_entries_for_user(
            user_id,
        )

        filtered_entries = [
            entry
            for entry in entries
            if entry.consumed_at.date() == dashboard_date
        ]

        dashboard_entries = [
            DashboardEntrySchema(
                id=entry.id,
                food_id=entry.food_id,

                quantity_g=entry.quantity_g,

                calories=entry.calories,
                protein_g=entry.protein_g,
                carbs_g=entry.carbs_g,
                fat_g=entry.fat_g,

                meal_type=entry.meal_type,

                consumed_at=entry.consumed_at,
            )
            for entry in filtered_entries
        ]

        meals = []

        for meal_type in MEAL_ORDER:
            meal_entries = [
                entry
                for entry in dashboard_entries
                if entry.meal_type == meal_type
            ]

            meals.append(
                DashboardMealSchema(
                    meal_type=meal_type,

                    total_calories=round(
                        sum(entry.calories for entry in meal_entries),
                        2,
                    ),
                    total_protein_g=round(
                        sum(entry.protein_g for entry in meal_entries),
                        2,
                    ),
                    total_carbs_g=round(
                        sum(entry.carbs_g for entry in meal_entries),
                        2,
                    ),
                    total_fat_g=round(
                        sum(entry.fat_g for entry in meal_entries),
                        2,
                    ),

                    entry_count=len(meal_entries),

                    entries=meal_entries,
                )
            )

        summary_schema = DashboardSummarySchema(
            total_calories=summary.total_calories,
            total_protein_g=summary.total_protein_g,
            total_carbs_g=summary.total_carbs_g,
            total_fat_g=summary.total_fat_g,

            entry_count=summary.entry_count,
        )

        targets_schema = None
        remaining_schema = None
        progress_schema = None

        if target is not None:
            targets_schema = DashboardTargetsSchema(
                calorie_target=target.calorie_target,

                protein_target_g=target.protein_target_g,
                carbs_target_g=target.carbs_target_g,
                fat_target_g=target.fat_target_g,
            )

            remaining_schema = DashboardRemainingSchema(
                calories=(
                    target.calorie_target
                    - summary.total_calories
                ),

                protein_g=(
                    target.protein_target_g
                    - summary.total_protein_g
                ),

                carbs_g=(
                    target.carbs_target_g
                    - summary.total_carbs_g
                ),

                fat_g=(
                    target.fat_target_g
                    - summary.total_fat_g
                ),
            )

            progress_schema = DashboardProgressSchema(
                calories_percent=round(
                    (
                        summary.total_calories
                        / target.calorie_target
                    ) * 100,
                    2,
                ),

                protein_percent=round(
                    (
                        summary.total_protein_g
                        / target.protein_target_g
                    ) * 100,
                    2,
                )
                if target.protein_target_g > 0
                else None,

                carbs_percent=round(
                    (
                        summary.total_carbs_g
                        / target.carbs_target_g
                    ) * 100,
                    2,
                )
                if target.carbs_target_g > 0
                else None,

                fat_percent=round(
                    (
                        summary.total_fat_g
                        / target.fat_target_g
                    ) * 100,
                    2,
                )
                if target.fat_target_g > 0
                else None,
            )

        return DashboardResponseSchema(
            date=dashboard_date,

            profile_completed=user.profile_completed,
            has_nutrition_target=target is not None,

            summary=summary_schema,

            targets=targets_schema,
            remaining=remaining_schema,
            progress=progress_schema,

            entries=dashboard_entries,

            meals=meals,
        )
    
    async def get_weekly_dashboard(
        self,
        user_id: str,
        target_date: date,
    ) -> WeeklyDashboardResponseSchema:
        week_start = target_date - timedelta(days=target_date.weekday())
        week_end = week_start + timedelta(days=6)

        target = await self.target_service.get_target_by_user_id(user_id)

        days = []

        for offset in range(7):
            current_date = week_start + timedelta(days=offset)

            summary = await self.summary_service.get_daily_summary(
                user_id=user_id,
                summary_date=current_date,
            )

            calorie_target = None
            calories_remaining = None
            calories_percent = None

            if target is not None:
                calorie_target = target.calorie_target
                calories_remaining = (
                    target.calorie_target - summary.total_calories
                )
                calories_percent = round(
                    (summary.total_calories / target.calorie_target) * 100,
                    2,
                )

            days.append(
                WeeklyDashboardDaySchema(
                    date=current_date,

                    total_calories=summary.total_calories,
                    total_protein_g=summary.total_protein_g,
                    total_carbs_g=summary.total_carbs_g,
                    total_fat_g=summary.total_fat_g,

                    entry_count=summary.entry_count,

                    calorie_target=calorie_target,
                    calories_remaining=calories_remaining,
                    calories_percent=calories_percent,
                )
            )

        return WeeklyDashboardResponseSchema(
            week_start=week_start,
            week_end=week_end,
            days=days,
        )