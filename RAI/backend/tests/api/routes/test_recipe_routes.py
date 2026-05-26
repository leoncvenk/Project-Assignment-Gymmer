import pytest


@pytest.mark.asyncio
async def test_list_recipes_returns_paginated_response(client):
    response = await client.get("/recipes?page=1&limit=10")

    assert response.status_code == 200

    data = response.json()

    assert "recipes" in data
    assert data["page"] == 1
    assert data["limit"] == 10
    assert "has_more" in data
    assert len(data["recipes"]) >= 1


@pytest.mark.asyncio
async def test_list_recipes_filters_by_category(client):
    response = await client.get("/recipes?category=high_protein&page=1&limit=10")

    assert response.status_code == 200

    data = response.json()

    assert len(data["recipes"]) >= 1

    for recipe in data["recipes"]:
        assert "high_protein" in recipe["categories"]


@pytest.mark.asyncio
async def test_list_recipes_rejects_invalid_page(client):
    response = await client.get("/recipes?page=0&limit=10")

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_recipes_rejects_invalid_limit(client):
    response = await client.get("/recipes?page=1&limit=0")

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_recipe_by_id_returns_recipe(client):
    list_response = await client.get("/recipes?page=1&limit=10")
    recipe_id = list_response.json()["recipes"][0]["id"]

    response = await client.get(f"/recipes/{recipe_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == recipe_id
    assert "title" in data
    assert "url" in data
    assert "image_url" in data
    assert "categories" in data
    assert "ingredients" in data
    assert "instructions" in data
    assert "nutritional_values" in data
    assert "calories" in data["nutritional_values"]
    assert "protein_g" in data["nutritional_values"]


@pytest.mark.asyncio
async def test_get_recipe_by_id_returns_404_for_missing_recipe(client):
    response = await client.get("/recipes/missing-recipe")

    assert response.status_code == 404