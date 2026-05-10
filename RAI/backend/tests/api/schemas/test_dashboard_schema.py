from datetime import date, datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas.dashboard_schema import (
    DashboardEntrySchema,
    DashboardProgressSchema,
    DashboardRemainingSchema,
    DashboardResponseSchema,
    DashboardSummarySchema,
    DashboardTargetsSchema,
)


def test_dashboard_summary_schema_valid():
    summary = DashboardSummarySchema(
        total_calories=1450,
        total_protein_g=110,
        total_carbs_g=160,
        total_fat_g=45,
        entry_count=5,
    )

    assert summary.total_calories == 1450
    assert summary.entry_count == 5


def test_dashboard_summary_rejects_negative_values():
    with pytest.raises(ValidationError):
        DashboardSummarySchema(
            total_calories=-1,
            total_protein_g=110,
            total_carbs_g=160,
            total_fat_g=45,
            entry_count=5,
        )


def test_dashboard_targets_schema_valid():
    targets = DashboardTargetsSchema(
        calorie_target=2200,
        protein_target_g=180,
        carbs_target_g=220,
        fat_target_g=70,
    )

    assert targets.calorie_target == 2200
    assert targets.protein_target_g == 180


def test_dashboard_targets_allow_none_values():
    targets = DashboardTargetsSchema()

    assert targets.calorie_target is None
    assert targets.protein_target_g is None
    assert targets.carbs_target_g is None
    assert targets.fat_target_g is None


def test_dashboard_targets_reject_invalid_calorie_target():
    with pytest.raises(ValidationError):
        DashboardTargetsSchema(
            calorie_target=0,
        )


def test_dashboard_remaining_schema_valid():
    remaining = DashboardRemainingSchema(
        calories=750,
        protein_g=70,
        carbs_g=60,
        fat_g=25,
    )

    assert remaining.calories == 750
    assert remaining.protein_g == 70


def test_dashboard_progress_schema_valid():
    progress = DashboardProgressSchema(
        calories_percent=65.91,
        protein_percent=61.11,
        carbs_percent=72.73,
        fat_percent=64.29,
    )

    assert progress.calories_percent == 65.91
    assert progress.protein_percent == 61.11


def test_dashboard_progress_rejects_negative_percent():
    with pytest.raises(ValidationError):
        DashboardProgressSchema(
            calories_percent=-1,
        )


def test_dashboard_entry_schema_valid():
    now = datetime.now(timezone.utc)

    entry = DashboardEntrySchema(
        id="entry-123",
        food_id="food-123",
        quantity_g=150,
        calories=247.5,
        protein_g=46.5,
        carbs_g=0,
        fat_g=5.4,
        consumed_at=now,
    )

    assert entry.id == "entry-123"
    assert entry.quantity_g == 150
    assert entry.calories == 247.5


def test_dashboard_entry_rejects_invalid_quantity():
    now = datetime.now(timezone.utc)

    with pytest.raises(ValidationError):
        DashboardEntrySchema(
            id="entry-123",
            food_id="food-123",
            quantity_g=0,
            calories=247.5,
            protein_g=46.5,
            carbs_g=0,
            fat_g=5.4,
            consumed_at=now,
        )


def test_dashboard_response_schema_valid():
    now = datetime.now(timezone.utc)

    dashboard = DashboardResponseSchema(
        date=date(2026, 5, 10),

        profile_completed=True,
        has_nutrition_target=True,

        summary=DashboardSummarySchema(
            total_calories=1450,
            total_protein_g=110,
            total_carbs_g=160,
            total_fat_g=45,
            entry_count=1,
        ),

        targets=DashboardTargetsSchema(
            calorie_target=2200,
            protein_target_g=180,
            carbs_target_g=220,
            fat_target_g=70,
        ),

        remaining=DashboardRemainingSchema(
            calories=750,
            protein_g=70,
            carbs_g=60,
            fat_g=25,
        ),

        progress=DashboardProgressSchema(
            calories_percent=65.91,
            protein_percent=61.11,
            carbs_percent=72.73,
            fat_percent=64.29,
        ),

        entries=[
            DashboardEntrySchema(
                id="entry-123",
                food_id="food-123",
                quantity_g=150,
                calories=247.5,
                protein_g=46.5,
                carbs_g=0,
                fat_g=5.4,
                consumed_at=now,
            )
        ],
    )

    assert dashboard.date == date(2026, 5, 10)
    assert dashboard.profile_completed is True
    assert dashboard.has_nutrition_target is True
    assert dashboard.summary.entry_count == 1
    assert len(dashboard.entries) == 1


def test_dashboard_response_allows_missing_targets():
    dashboard = DashboardResponseSchema(
        date=date(2026, 5, 10),

        profile_completed=False,
        has_nutrition_target=False,

        summary=DashboardSummarySchema(
            total_calories=0,
            total_protein_g=0,
            total_carbs_g=0,
            total_fat_g=0,
            entry_count=0,
        ),

        targets=None,
        remaining=None,
        progress=None,

        entries=[],
    )

    assert dashboard.targets is None
    assert dashboard.remaining is None
    assert dashboard.progress is None