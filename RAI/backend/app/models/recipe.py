from dataclasses import dataclass
from typing import List


@dataclass
class NutritionalValues:
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float


@dataclass
class Recipe:
    id: str
    title: str
    url: str
    image_url: str
    categories: List[str]
    ingredients: List[str]
    instructions: List[str]
    nutritional_values: NutritionalValues