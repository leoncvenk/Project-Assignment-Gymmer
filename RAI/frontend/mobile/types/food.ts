export type FoodSource = "manual" | "open_food_facts" | "internal"

export type Food = {
    id: string;
    name: string;
    brand: string | null;
    barcode: string | null;
    category: string | null;
    calories_per_100g: 0 | null;
    protein_g_per_100g: 0 | null;
    carbs_g_per_100g: 0 | null;
    fat_g_per_100g: 0 | null;
    fiber_per_100g: 0 | null;
    sugar_per_100g: 0 | null;
    salt_per_100g: 0 | null;
    source: FoodSource;
    source_id: string | null;
    image_url: string | null;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export type FoodSearchParams = {
    query: string;
    limit?: number;
    skip?: number;
}

export type CreateFoodRequest = {
  name: string;
  brand?: string;
  calories_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
};