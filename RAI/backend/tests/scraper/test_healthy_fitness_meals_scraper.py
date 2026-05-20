import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2] / "scraper"))

from healthy_fitness_meals_scraper import (
    CATEGORIES,
    get_category_recipes,
    get_recipe_details,
)


def test_get_category_recipes_returns_recipes():
    recipes = get_category_recipes("high_protein", CATEGORIES["high_protein"])

    assert isinstance(recipes, list)
    assert len(recipes) > 0
    assert "title" in recipes[0]
    assert "url" in recipes[0]
    assert "category" in recipes[0]


def test_get_recipe_details_returns_details():
    recipe = {
        "title": "Yogurt Marinated Chicken",
        "url": "https://healthyfitnessmeals.com/yogurt-marinated-chicken/",
        "category": "fan_favourite",
    }

    detailed_recipe = get_recipe_details(recipe)

    assert isinstance(detailed_recipe["ingredients"], list)
    assert isinstance(detailed_recipe["instructions"], list)
    assert len(detailed_recipe["ingredients"]) > 0
    assert len(detailed_recipe["instructions"]) > 0
    assert "calories" in detailed_recipe
    assert "protein" in detailed_recipe