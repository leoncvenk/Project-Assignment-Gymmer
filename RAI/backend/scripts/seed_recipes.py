import json
import re
import uuid
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings


RECIPES_JSON_PATH = Path("recipes.json")
RECIPES_COLLECTION = "recipes"


CATEGORY_MAP = {
    "high_protein": "high_protein",
    "my_favorites": "most_popular",
    "all_recipes": "all_recipes",
}


def parse_number(value):
    if value is None:
        return 0

    value = str(value)
    match = re.search(r"\d+(\.\d+)?", value)

    if not match:
        return 0

    return float(match.group())


def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")

    if not text:
        return str(uuid.uuid4())

    return text


def normalize_recipe(recipe, category_name):
    mapped_category = CATEGORY_MAP.get(category_name, category_name)

    title = recipe.get("title", "").strip()
    url = recipe.get("url", "").strip()
    image_url = recipe.get("image_url")

    if not title or not url:
        return None

    if not image_url:
        image_url = "https://placehold.co/600x400?text=Recipe"

    return {
        "id": slugify(title),
        "title": title,
        "url": url,
        "image_url": image_url,
        "categories": [mapped_category],
        "ingredients": recipe.get("ingredients", []),
        "instructions": recipe.get("instructions", []),
        "nutritional_values": {
            "calories": parse_number(recipe.get("calories")),
            "protein_g": parse_number(recipe.get("protein")),
            "carbs_g": 0,
            "fat_g": 0,
        },
    }


async def main():
    if not RECIPES_JSON_PATH.exists():
        print(f"Napaka: {RECIPES_JSON_PATH} ne obstaja.")
        print("Najprej zaženi: python scraper/healthy_fitness_meals_scraper.py")
        return

    with open(RECIPES_JSON_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    collection = db[RECIPES_COLLECTION]

    inserted_or_updated = 0
    skipped = 0

    for category_name, recipes in data.items():
        for recipe in recipes:
            document = normalize_recipe(recipe, category_name)

            if document is None:
                skipped += 1
                continue

            await collection.replace_one(
                {"id": document["id"]},
                document,
                upsert=True,
            )

            inserted_or_updated += 1

    await collection.create_index("id", unique=True)

    client.close()

    print("Seed končan.")
    print(f"Dodanih/posodobljenih receptov: {inserted_or_updated}")
    print(f"Preskočenih receptov: {skipped}")
    print(f"Collection: {settings.DB_NAME}.{RECIPES_COLLECTION}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())