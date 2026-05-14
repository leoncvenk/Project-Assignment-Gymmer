from datetime import date, datetime, time, timedelta

from app.core.database import get_db
from app.schemas.nutrition_summary_schema import (
    NutritionSummaryResponseSchema,
)
from app.services.food_entry_service import FOOD_ENTRIES_COLLECTION


class NutritionSummaryService:
    @property
    def collection(self):
        return get_db()[FOOD_ENTRIES_COLLECTION]

    async def get_daily_summary(
        self,
        user_id: str,
        summary_date: date,
    ) -> NutritionSummaryResponseSchema:
        start_of_day = datetime.combine(
            summary_date,
            time.min,
        )

        end_of_day = start_of_day + timedelta(days=1)

        cursor = self.collection.find(
            {
                "user_id": user_id,
                "consumed_at": {
                    "$gte": start_of_day,
                    "$lt": end_of_day,
                },
            }
        )

        entries = await cursor.to_list(length=None)

        total_calories = round(
            sum(entry.get("calories", 0) for entry in entries),
            2,
        )

        total_protein_g = round(
            sum(entry.get("protein_g", 0) for entry in entries),
            2,
        )

        total_carbs_g = round(
            sum(entry.get("carbs_g", 0) for entry in entries),
            2,
        )

        total_fat_g = round(
            sum(entry.get("fat_g", 0) for entry in entries),
            2,
        )

        return NutritionSummaryResponseSchema(
            date=summary_date,
            total_calories=total_calories,
            total_protein_g=total_protein_g,
            total_carbs_g=total_carbs_g,
            total_fat_g=total_fat_g,
            entry_count=len(entries),
        )