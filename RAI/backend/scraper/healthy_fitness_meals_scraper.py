import requests
import html
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

if __name__ == "__main__":
    all_recipes = get_all_categories()

    for category_name, recipes in all_recipes.items():
        print(f"\n{category_name.upper()}")
        print(f"Najdenih receptov: {len(recipes)}")

        for recipe in recipes:
            print(f"- {recipe['title']} ({recipe['url']})")