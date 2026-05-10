from datetime import date

import pytest
from pydantic import ValidationError

from app.schemas.nutrition_summary_schema import NutritionSummaryResponseSchema


def test_nutrition_summary_response_valid():
    summary = NutritionSummaryResponseSchema(
        date=date(2026, 5, 10),
        total_calories=2140,
        total_protein_g=182,
        total_carbs_g=190,
        total_fat_g=71,
        entry_count=6,
    )

    assert summary.date == date(2026, 5, 10)
    assert summary.total_calories == 2140
    assert summary.total_protein_g == 182
    assert summary.total_carbs_g == 190
    assert summary.total_fat_g == 71
    assert summary.entry_count == 6


def test_nutrition_summary_rejects_negative_totals():
    with pytest.raises(ValidationError):
        NutritionSummaryResponseSchema(
            date=date(2026, 5, 10),
            total_calories=-1,
            total_protein_g=0,
            total_carbs_g=0,
            total_fat_g=0,
            entry_count=0,
        )


def test_nutrition_summary_rejects_negative_entry_count():
    with pytest.raises(ValidationError):
        NutritionSummaryResponseSchema(
            date=date(2026, 5, 10),
            total_calories=0,
            total_protein_g=0,
            total_carbs_g=0,
            total_fat_g=0,
            entry_count=-1,
        )