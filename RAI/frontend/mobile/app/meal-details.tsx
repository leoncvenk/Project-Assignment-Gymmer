import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAuthToken } from 'lib/auth';
import { getDashboard } from 'lib/dashboard';
import { DashboardMeal } from 'types/dashboard';

function formatMealTitle(mealType: string) {
  return mealType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function MealDetailsScreen() {
  const { mealType } = useLocalSearchParams<{ mealType: string }>();

  const [meal, setMeal] = useState<DashboardMeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeal = useCallback(async () => {
    try {
      setError(null);

      const token = await getAuthToken();

      if (!token) {
        setError('Missing authentication token.');
        return;
      }

      const dashboard = await getDashboard(token);

      const selectedMeal = dashboard.meals.find((item) => item.meal_type === mealType) ?? null;

      setMeal(selectedMeal);
    } catch {
      setError('Could not load meal details.');
    } finally {
      setIsLoading(false);
    }
  }, [mealType]);

  useFocusEffect(
    useCallback(() => {
      loadMeal();
    }, [loadMeal])
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
        <Text className="mt-4 text-muted">Loading meal...</Text>
      </SafeAreaView>
    );
  }

  if (error || !meal) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-lg font-semibold text-text">
          {error ?? 'Meal not found.'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingTop: 24 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-8 flex-row items-center gap-2">
          <ArrowLeft size={20} color="#111827" />
          <Text className="text-sm font-medium text-text">Back</Text>
        </TouchableOpacity>

        <View className="mb-8">
          <Text className="text-4xl font-bold text-text">{formatMealTitle(meal.meal_type)}</Text>

          <Text className="mt-3 text-base text-muted">
            View nutrition totals and logged entries.
          </Text>
        </View>

        <View className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-text">Meal Summary</Text>

          <View className="flex-row flex-wrap gap-4">
            <Text className="text-sm text-muted">{meal.total_calories} kcal</Text>
            <Text className="text-sm text-muted">P {meal.total_protein_g}g</Text>
            <Text className="text-sm text-muted">C {meal.total_carbs_g}g</Text>
            <Text className="text-sm text-muted">F {meal.total_fat_g}g</Text>
          </View>

          <Text className="mt-4 text-sm text-muted">Entries: {meal.entry_count}</Text>
        </View>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-text">Entries</Text>

          {meal.entries.length === 0 ? (
            <Text className="text-sm text-muted">No entries logged for this meal.</Text>
          ) : (
            <View className="gap-4">
              {meal.entries.map((entry) => (
                <View key={entry.id} className="rounded-2xl border border-muted bg-background p-4">
                  <Text className="font-semibold text-text">Food ID: {entry.food_id}</Text>

                  <Text className="mt-1 text-sm text-muted">Quantity: {entry.quantity_g}g</Text>

                  <View className="mt-3 flex-row flex-wrap gap-4">
                    <Text className="text-sm text-muted">{entry.calories} kcal</Text>
                    <Text className="text-sm text-muted">P {entry.protein_g}g</Text>
                    <Text className="text-sm text-muted">C {entry.carbs_g}g</Text>
                    <Text className="text-sm text-muted">F {entry.fat_g}g</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
