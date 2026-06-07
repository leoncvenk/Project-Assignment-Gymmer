import requests
import html
import json
from bs4 import BeautifulSoup

BASE_URL = "https://healthyfitnessmeals.com"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

CATEGORIES = {
    "high_protein": {
        "base_url": "https://healthyfitnessmeals.com/category/high-protein/",
        "pages": 16
    },

    "my_favorites": {
        "base_url": "https://healthyfitnessmeals.com/category/my-favorites/",
        "pages": 4
    },

    "all_recipes": {
        "base_url": "https://healthyfitnessmeals.com/blog/",
        "pages": 92
    }
}


def get_category_recipes(category_name, category_config, limit=10, page=1):
    base_url = category_config["base_url"]

    if page <= 1:
        page_url = base_url
    else:
        page_url = f"{base_url}page/{page}/"

    response = requests.get(page_url, headers=HEADERS)

    if response.status_code != 200:
        print(f"Napaka pri kategoriji {category_name}: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")

    recipe_links = soup.select("article a[href]")

    recipes = []
    seen_urls = set()

    for recipe in recipe_links:

        title = html.unescape(
            recipe.get_text(" ", strip=True)
        ).replace("\xa0", " ")

        url = recipe.get("href")

        article = recipe.find_parent("article")
        image = article.find("img") if article else None

        image_url = None

        if image:
            image_url = image.get("data-lazy-src")
            
            if not image_url:
                image_url = image.get("data-src")

            if not image_url:
                srcset = image.get("srcset")
                if srcset:
                    image_url = srcset.split(",")[0].strip().split(" ")[0]

            if not image_url:
                src = image.get("src")
                if src and not src.startswith("data:image"):
                    image_url = src

        if not title or not url:
            continue

        if not url.startswith(BASE_URL):
            continue

        # preskoči category linke
        if "/category/" in url:
            continue

        # preskoči roundup/list članke
        title_lower = title.lower()
        url_lower = url.lower()

        blacklist = [
            "recipes",
            "roundup",
            "collection",
            "ideas",
            "best-",
            "side-dishes"
        ]

        if any(word in title_lower for word in blacklist):
            continue

        if any(word in url_lower for word in blacklist):
            continue

        # preskoči duplicate
        if url in seen_urls:
            continue

        seen_urls.add(url)

        recipes.append({
            "title": title,
            "url": url,
            "image_url": image_url,
            "category": category_name
        })

        if len(recipes) >= limit:
            break

    return recipes


def get_all_categories(limit=10, page=1):
    all_recipes = {}

    for category_name, category_config in CATEGORIES.items():
        recipes = get_category_recipes(
            category_name,
            category_config,
            limit=limit,
            page=page
        )

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

    LIMIT = 24
    PAGE = 1

    all_recipes = {}

    for category_name, category_config in CATEGORIES.items():

        print(f"\n{category_name.upper()}")

        recipes = get_category_recipes(
            category_name,
            category_config,
            limit=LIMIT,
            page=PAGE
        )

        print(f"Najdenih receptov: {len(recipes)}")

        detailed_recipes = []

        for recipe in recipes:

            print(f"- {recipe['title']} ({recipe['url']})")

            details = get_recipe_details(recipe)

            detailed_recipes.append(details)

        all_recipes[category_name] = detailed_recipes

    save_to_json(all_recipes, "recipes.json")

    print("\nPodatki shranjeni v recipes.json")