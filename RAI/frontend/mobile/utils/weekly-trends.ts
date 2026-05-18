import { WeeklyNutritionDay } from 'types/dashboard';

type WeeklyTrendDayDisplay = {
  date: string;
  shortLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  entryCount: number;
  adherencePercent: number;
};

type WeeklyTrendSummary = {
  overallAdherencePercent: number;
  targetHitDays: number;
  averageCalories: number;
  averageProtein: number;
};

function formatShortWeekday(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
  });
}

export function prepareWeeklyTrendDisplay(days: WeeklyNutritionDay[]) {
  const displayDays: WeeklyTrendDayDisplay[] = days.map((day) => {
    const adherencePercent =
      day.calories_percent !== null ? Math.min(Math.round(day.calories_percent), 100) : 0;

    return {
      date: day.date,
      shortLabel: formatShortWeekday(day.date),
      calories: day.total_calories,
      protein: day.total_protein_g,
      carbs: day.total_carbs_g,
      fats: day.total_fat_g,
      entryCount: day.entry_count,
      adherencePercent,
    };
  });

  const targetHitDays = displayDays.filter((day) => day.adherencePercent >= 90).length;

  const overallAdherencePercent =
    displayDays.length > 0
      ? Math.round(
          displayDays.reduce((sum, day) => sum + day.adherencePercent, 0) / displayDays.length
        )
      : 0;

  const averageCalories =
    displayDays.length > 0
      ? Math.round(displayDays.reduce((sum, day) => sum + day.calories, 0) / displayDays.length)
      : 0;

  const averageProtein =
    displayDays.length > 0
      ? Math.round(displayDays.reduce((sum, day) => sum + day.protein, 0) / displayDays.length)
      : 0;

  return {
    days: displayDays,
    summary: {
      overallAdherencePercent,
      targetHitDays,
      averageCalories,
      averageProtein,
    },
  };
}
