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

  remaining: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  } | null;

  progress: {
    calories_percent: number;
    protein_percent: number | null;
    carbs_percent: number | null;
    fat_percent: number | null;
  } | null;

  entries: DashboardEntry[];
  meals: DashboardMeal[];
};

export type WeeklyNutritionDay = {
  date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  entry_count: number;
  calorie_target: number | null;
  calories_remaining: number | null;
  calories_percent: number | null;
}

export type WeeklyNutritionDashboardResponse = {
  week_start: string;
  week_end: string;
  days: WeeklyNutritionDay[];
}