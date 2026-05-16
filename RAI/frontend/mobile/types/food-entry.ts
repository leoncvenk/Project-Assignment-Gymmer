export type MealType = 
    | "breakfast"
    | "lunch"
    | "dinner"
    | "snack"
    | "unspecified"

export type CreateFoodEntryRequest = {
    food_id: string;
    quantity_g: number;
    meal_type: MealType;
    consumed_at: string;
}

export type FoodEntry = {
    id: string;
    food_id: string;
    quantity_g: number;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    meal_type: MealType;
    consumed_at: string;
}