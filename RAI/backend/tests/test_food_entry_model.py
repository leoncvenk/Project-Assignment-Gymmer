from datetime import datetime, timezone

from app.models.food_entry import FoodEntry


def test_food_entry_model_creation():
    now = datetime.now(timezone.utc)

    entry = FoodEntry(
        id="entry-123",
        user_id="user-123",
        food_id="food-123",
        quantity_g=150,
        calories=247.5,
        protein_g=46.5,
        carbs_g=0,
        fat_g=5.4,
        consumed_at=now,
        created_at=now,
        updated_at=now,
    )

    assert entry.id == "entry-123"
    assert entry.user_id == "user-123"
    assert entry.food_id == "food-123"
    assert entry.quantity_g == 150

    assert entry.calories == 247.5
    assert entry.protein_g == 46.5
    assert entry.carbs_g == 0
    assert entry.fat_g == 5.4

    assert entry.consumed_at == now
    assert entry.created_at == now
    assert entry.updated_at == now


def test_food_entry_model_is_immutable():
    now = datetime.now(timezone.utc)

    entry = FoodEntry(
        id="entry-123",
        user_id="user-123",
        food_id="food-123",
        quantity_g=100,
        calories=100,
        protein_g=10,
        carbs_g=20,
        fat_g=5,
        consumed_at=now,
    )

    try:
        entry.quantity_g = 200
        mutated = True
    except Exception:
        mutated = False

    assert mutated is False