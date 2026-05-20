import requests
import html
import json
from bs4 import BeautifulSoup

BASE_URL = "https://healthyfitnessmeals.com"

CATEGORIES = {
    "high_protein": "https://healthyfitnessmeals.com/category/high-protein/",
    "fan_favorites": "https://healthyfitnessmeals.com/category/my-favorites/",
    "all_recipes": "https://healthyfitnessmeals.com/recipe-index/",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

CATEGORIES = {
    "high_protein":
        "https://healthyfitnessmeals.com/wp-json/wp/v2/posts?per_page=10&search=protein",

    "fan_favourite":
        "https://healthyfitnessmeals.com/wp-json/wp/v2/posts?per_page=10",

    "all_recipes":
        "https://healthyfitnessmeals.com/wp-json/wp/v2/posts?per_page=20"
}

def get_category_recipes(category_name, category_url):
    response = requests.get(category_url, headers=HEADERS)

    data = response.json()

    recipes = []

    for recipe in data:
        title = html.unescape(recipe["title"]["rendered"]).replace("\xa0", " ")
        url = recipe["link"]

        recipes.append({
            "title": title,
            "url": url,
            "category": category_name
        })

    return recipes

def get_all_categories():
    all_recipes = {}

    for category_name, category_url in CATEGORIES.items():
        recipes = get_category_recipes(category_name, category_url)
        all_recipes[category_name] = recipes

    return all_recipes

def get_recipe_details(recipe):

    response = requests.get(recipe["url"], headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    ingredients = []
    instructions = []

    calories = None
    protein = None

    ingredient_items = soup.select(".wprm-recipe-ingredient")

    for item in ingredient_items:

        text = (
            item.get_text(" ", strip=True)
            .replace("▢", "")
            .replace("􀀓", "-")
            .strip()
        )

        if text:
            ingredients.append(text)

    instruction_items = soup.select(".wprm-recipe-instruction-text")

    for item in instruction_items:

        text = (
            item.get_text(" ", strip=True)
            .replace("▢", "")
            .replace("􀀓", "-")
            .strip()
        )

        if text:
            instructions.append(text)

    nutrition_items = soup.select(".wprm-nutrition-label-text-nutrition-container")

    for item in nutrition_items:

        label = item.select_one(".wprm-nutrition-label-text-nutrition-label")
        value = item.select_one(".wprm-nutrition-label-text-nutrition-value")

        if not label or not value:
            continue

        label_text = label.get_text(strip=True).lower()
        value_text = value.get_text(strip=True)

        if "calories" in label_text:
            calories = value_text

        if "protein" in label_text:
            protein = value_text

    recipe["ingredients"] = ingredients
    recipe["instructions"] = instructions
    recipe["calories"] = calories
    recipe["protein"] = protein

    return recipe

def save_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

if __name__ == "__main__":

    all_recipes = {}

    for category_name, category_url in CATEGORIES.items():

        print(f"\n{category_name.upper()}")

        recipes = get_category_recipes(category_name, category_url)

        print(f"Najdenih receptov: {len(recipes)}")

        detailed_recipes = []

        for recipe in recipes:

            print(f"- {recipe['title']} ({recipe['url']})")

            details = get_recipe_details(recipe)

            detailed_recipes.append(details)

        all_recipes[category_name] = detailed_recipes

    import json

    with open("recipes.json", "w", encoding="utf-8") as f:
        json.dump(all_recipes, f, indent=4, ensure_ascii=False)

    print("\nPodatki shranjeni v recipes.json")