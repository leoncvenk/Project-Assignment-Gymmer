from app.schemas.food_schema import CreateFoodSchema
from app.services.food_service import FoodService, UNKNOWN_BRAND

def test_create_food_stores_food_by_id():
    service = FoodService()

    food = service.create_food(CreateFoodSchema(name="Chicken"))

    assert food.id in service.foods_by_id
    assert service.foods_by_id[food.id] == food

def test_create_food_normalizes_name_and_brand():
    service = FoodService()

    food = service.create_food(
        CreateFoodSchema(
            name="  Chicken  ",
            brand="  Perutnina Ptuj  ",
        )
    )

    assert food.name == "Chicken"
    assert food.brand == "Perutnina Ptuj"

def test_create_food_missing_brand_becomes_unknown():
    service = FoodService()

    food = service.create_food(CreateFoodSchema(name="Rice"))

    assert food.brand == UNKNOWN_BRAND

def test_create_food_empty_brand_becomes_unknown():
    service = FoodService()

    food = service.create_food(
        CreateFoodSchema(
            name="Rice",
            brand="   ",
        )
    )

    assert food.brand == UNKNOWN_BRAND

def test_create_food_user_cannot_set_verified_true():
    service = FoodService()

    food = service.create_food(
        CreateFoodSchema(
            name="Protein bar",
            is_verified=True,
        )
    )

    assert food.is_verified is False

def test_create_food_with_barcode_stores_by_barcode():
    service = FoodService()

    food = service.create_food(
        CreateFoodSchema(
            name="Milk",
            barcode=" 123456 ",
        )
    )

    assert food.barcode == "123456"
    assert service.foods_by_barcode["123456"] == food

def test_create_food_duplicate_barcode_returns_existing_food():
    service = FoodService()

    first = service.create_food(
        CreateFoodSchema(
            name="Milk",
            barcode="123456",
        )
    )

    second = service.create_food(
        CreateFoodSchema(
            name="Different Milk",
            barcode="123456",
        )
    )

    assert second == first
    assert len(service.foods_by_id) == 1

def test_get_food_by_id_existing_food():
    service = FoodService()

    food = service.create_food(CreateFoodSchema(name="Apple"))

    result = service.get_food_by_id(food.id)

    assert result == food

def test_get_food_by_id_missing_food_returns_none():
    service = FoodService()

    result = service.get_food_by_id("missing-id")

    assert result is None

def test_get_food_by_barcode_existing_food():
    service = FoodService()

    food = service.create_food(
        CreateFoodSchema(
            name="Banana",
            barcode="987654",
        )
    )

    result = service.get_food_by_barcode("987654")

    assert result == food

def test_get_food_by_barcode_strips_input():
    service = FoodService()

    food = service.create_food(
        CreateFoodSchema(
            name="Banana",
            barcode="987654",
        )
    )

    result = service.get_food_by_barcode(" 987654 ")

    assert result == food

def test_request_verification_existing_food_returns_true():
    service = FoodService()

    food = service.create_food(CreateFoodSchema(name="Apple"))

    result = service.request_verification(food.id, user_id="user-123")

    assert result is True

def test_request_verification_missing_food_returns_false():
    service = FoodService()

    result = service.request_verification("missing-id", user_id="user-123")

    assert result is False