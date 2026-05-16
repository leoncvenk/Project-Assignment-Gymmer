import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import { layout } from 'constants/theme';
import { getAuthToken } from 'lib/auth';
import { getDashboard } from 'lib/dashboard';
import { DashboardResponse } from 'types/dashboard';
import { router } from 'expo-router';

function formatMealTitle(mealType: string) {
  return mealType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function NutritionScreen() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = await getAuthToken();

        if (!token) {
          setError('Missing authentication token.');
          return;
        }

        const data = await getDashboard(token);
        setDashboard(data);
      } catch {
        setError('Could not load nutrition dashboard.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
        <Text className="mt-4 text-muted">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (error || !dashboard) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-lg font-semibold text-text">
          {error ?? 'Dashboard data unavailable.'}
        </Text>
      </SafeAreaView>
    );
  }

  const targets = dashboard.targets;
  const meals = dashboard.meals.filter((meal) => meal.entry_count > 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingTop: 32,
          paddingBottom: layout.floatingTabBarSafePadding,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-4xl font-bold text-text">Today&apos;s Nutrition</Text>

          <Text className="mt-3 text-base text-muted">
            Track your daily calorie and macro progress.
          </Text>
        </View>

        <View className="mb-6 flex-row gap-4">
          <DashboardStatCard
            title="Calories"
            value={`${dashboard.summary.total_calories}`}
            description={targets ? `/ ${targets.calorie_target} kcal` : 'no target'}
            percent={dashboard.progress?.calories_percent ?? 0}
          />

          <DashboardStatCard
            title="Protein"
            value={`${dashboard.summary.total_protein_g}g`}
            description={targets ? `/ ${targets.protein_target_g}g` : 'no target'}
            percent={dashboard.progress?.protein_percent ?? 0}
          />
        </View>

        <View className="mb-8 flex-row gap-4">
          <DashboardStatCard
            title="Carbs"
            value={`${dashboard.summary.total_carbs_g}g`}
            description={targets ? `/ ${targets.carbs_target_g}g` : 'no target'}
            percent={dashboard.progress?.carbs_percent ?? 0}
          />

          <DashboardStatCard
            title="Fats"
            value={`${dashboard.summary.total_fat_g}g`}
            description={targets ? `/ ${targets.fat_target_g}g` : 'no target'}
            percent={dashboard.progress?.fat_percent ?? 0}
          />
        </View>

        <DashboardSectionCard title="Meals" subtitle="Today's logged meals and nutrition totals.">
          <View className="gap-4">
            {dashboard.meals.map((meal) => (
              <View
                key={meal.meal_type}
                className="rounded-2xl border border-muted bg-background p-4">
                <Text className="text-lg font-semibold text-text">
                  {formatMealTitle(meal.meal_type)}
                </Text>

                <View className="mt-3 flex-row flex-wrap gap-4">
                  <Text className="text-sm text-muted">{meal.total_calories} kcal</Text>
                  <Text className="text-sm text-muted">P {meal.total_protein_g}g</Text>
                  <Text className="text-sm text-muted">C {meal.total_carbs_g}g</Text>
                  <Text className="text-sm text-muted">F {meal.total_fat_g}g</Text>
                </View>

                <View className="my-4 h-px bg-muted/40" />

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Entries: {meal.entry_count}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: 'food-entry',
                        params: {
                          mealType: meal.meal_type,
                        },
                      })
                    }>
                    <Text className="text-sm font-semibold text-accent">Add Entry</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </DashboardSectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}
