import requests
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


def get_category_recipes(category_name, category_url):
    pass


def get_recipe_details(recipe_url):
    pass


if __name__ == "__main__":
    print("Healthy Fitness Meals scraper")