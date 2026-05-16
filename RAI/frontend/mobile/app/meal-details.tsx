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

        <View className="rounded-3xl border border-muted bg-white p-6">
          <Text className="text-lg font-semibold text-text">Meal Summary</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
