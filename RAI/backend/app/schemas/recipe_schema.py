from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class NutritionalValuesSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    calories: float = Field(..., ge=0)
    protein_g: float = Field(..., ge=0)
    carbs_g: float = Field(..., ge=0)
    fat_g: float = Field(..., ge=0)


class RecipeResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    url: HttpUrl
    image_url: HttpUrl
    categories: list[str]
    ingredients: list[str]
    instructions: list[str]
    nutritional_values: NutritionalValuesSchema


class RecipeListResponseSchema(BaseModel):
    recipes: list[RecipeResponseSchema]
    page: int
    limit: int
    has_more: bool