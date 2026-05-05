from dataclasses import replace
from datetime import datetime, timezone
from uuid import uuid4

from app.models.food import Food
from app.schemas.food_schema import CreateFoodSchema, UpdateFoodSchema

UNKNOWN_BRAND = None

def _now() -> datetime:
    return datetime.now(timezone.utc)

def _normalize_brand(brand: str | None) -> str:
    if brand is None or brand.strip() == "":
        return UNKNOWN_BRAND
    
    return brand.strip()

class FoodService:
    def __init__(self):
        self.foods_by_id: dict[str, Food] = {}
        self.foods_by_barcode: dict[str, Food] = {}

    def create_food(self, data: CreateFoodSchema) -> Food:
        """
        Create a new food.

        Rules:
        - barcode is unique
        - if barcode already exists, return existing food
        - duplicate names are allowed
        - missing brand becomes "Unknown"
        - users cannot verify food directly
        - food is not overwritten by new scans/imports
        """

        if data.barcode and data.barcode in self.foods_by_barcode:
            return self.foods_by_barcode[data.barcode]

        now = _now()

        food = Food(
            id=str(uuid4()),
            name=data.name.strip(),
            brand=_normalize_brand(data.brand),
            barcode=data.barcode.strip() if data.barcode else None,
            category=data.category.strip() if data.category else None,
            source=data.source,
            source_id=data.source_id.strip() if data.source_id else None,
            image_url=data.image_url,
            is_verified=False,
            created_at=now,
            updated_at=now,
        )

        self.foods_by_id[food.id] = food

        if food.barcode:
            self.foods_by_barcode[food.barcode] = food

        return food
    
    def update_food(self, food_id: str, data: UpdateFoodSchema):
        food = self.get_food_by_id(food_id)

        if food is None:
            return None

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            if isinstance(value, str):
                update_data[key] = value.strip()

        updated_food = replace(
            food,
            **update_data,
            updated_at=datetime.now(timezone.utc),
        )

        self.foods_by_id[food_id] = updated_food

        if food.barcode and food.barcode != updated_food.barcode:
            self.foods_by_barcode.pop(food.barcode, None)

        if updated_food.barcode:
            self.foods_by_barcode[updated_food.barcode] = updated_food

        return updated_food

    def get_food_by_id(self, food_id: str) -> Food | None:
        return self.foods_by_id.get(food_id)

    def get_food_by_barcode(self, barcode: str) -> Food | None:
        normalized_barcode = barcode.strip()
        return self.foods_by_barcode.get(normalized_barcode)

    def request_verification(self, food_id: str, user_id: str) -> bool:
        """
        Placeholder for future verification flow.

        Later:
        - user requests verification
        - request is stored
        - when enough requests exist, admin is notified
        - admin decides whether food becomes verified
        """

        food = self.get_food_by_id(food_id)

        if food is None:
            return False

        return True