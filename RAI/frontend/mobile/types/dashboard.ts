export type DashboardEntry = {
  id: string;
  food_id: string;
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  consumed_at: string;
};

export type DashboardMeal = {
  meal_type: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  entry_count: number;
  entries: DashboardEntry[];
};

export type DashboardResponse = {
  date: string;
  profile_completed: boolean;
  has_nutrition_target: boolean;
  summary: {
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
    entry_count: number;
  };
  targets: {
    calorie_target: number;
    protein_target_g: number;
    carbs_target_g: number;
    fat_target_g: number;
  } | null;
  meals: DashboardMeal[];
};