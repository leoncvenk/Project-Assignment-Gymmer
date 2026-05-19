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


if __name__ == "__main__":

    recipes = get_category_recipes(
        "high_protein",
        CATEGORIES["high_protein"]
    )

    print(f"Najdenih receptov: {len(recipes)}")

    for recipe in recipes:
        print(recipe)