import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import { layout } from 'constants/theme';
import { getAuthToken } from 'lib/auth';
import { getDashboard, getWeeklyNutritionDashboard } from 'lib/dashboard';
import { DashboardResponse, WeeklyNutritionDashboardResponse } from 'types/dashboard';
import { router, useFocusEffect } from 'expo-router';
import { prepareWeeklyTrendDisplay } from 'utils/weekly-trends';
import { isAxiosError } from 'axios';

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
  const [weeklyDashboard, setWeeklyDashboard] = useState<WeeklyNutritionDashboardResponse | null>(
    null
  );

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);

      const token = await getAuthToken();

      if (!token) {
        router.replace('/(auth)/login');
        return;
      }

      const [dailyData, weeklyData] = await Promise.all([
        getDashboard(token),
        getWeeklyNutritionDashboard(token),
      ]);

      setDashboard(dailyData);
      setWeeklyDashboard(weeklyData);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        router.replace('/(auth)/login');
        return;
      }

      setError('Could not load nutrition dashboard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

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
  const weeklyTrendDisplay = weeklyDashboard
    ? prepareWeeklyTrendDisplay(weeklyDashboard.days)
    : null;

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
              <TouchableOpacity
                key={meal.meal_type}
                activeOpacity={0.9}
                className="rounded-2xl border border-muted bg-background p-4"
                onPress={() =>
                  router.push({
                    pathname: '/meal-details',
                    params: {
                      mealType: meal.meal_type,
                    },
                  })
                }>
                <Text className="text-lg font-semibold text-text">
                  {formatMealTitle(meal.meal_type)}
                </Text>

                <View className="mt-3 flex-row flex-wrap gap-4">
                  <Text className="text-sm text-muted">{meal.total_calories} kcal</Text>
                  <Text className="text-sm text-muted">P {meal.total_protein_g}g</Text>
                  <Text className="text-sm text-muted">C {meal.total_carbs_g}g</Text>
                  <Text className="text-sm text-muted">F {meal.total_fat_g}g</Text>
                </View>

                <Text className="mt-3 text-xs font-medium text-accent">View details</Text>

                <View className="mb-4 mt-3 h-px bg-muted/40" />

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Entries: {meal.entry_count}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/food-entry',
                        params: {
                          mealType: meal.meal_type,
                        },
                      })
                    }>
                    <Text className="text-sm font-semibold text-accent">Add Entry</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </DashboardSectionCard>

        {weeklyTrendDisplay ? (
          <View className="mt-8">
            <DashboardSectionCard
              title="Weekly Trends"
              subtitle="Nutrition totals across the current week.">
              <View className="gap-4">
                <View className="mb-5 rounded-2xl border border-accent bg-accent/10 p-5">
                  <Text className="text-sm font-semibold text-accent">Weekly adherence</Text>

                  <Text className="mt-2 text-4xl font-bold text-text">
                    {weeklyTrendDisplay.summary.overallAdherencePercent}%
                  </Text>

                  <Text className="mt-2 text-sm text-muted">
                    {weeklyTrendDisplay.summary.targetHitDays} / 7 days near target
                  </Text>

                  <View className="mt-4 flex-row gap-4">
                    <Text className="text-sm text-muted">
                      Avg {weeklyTrendDisplay.summary.averageCalories} kcal
                    </Text>

                    <Text className="text-sm text-muted">
                      Avg P {weeklyTrendDisplay.summary.averageProtein}g
                    </Text>
                  </View>
                </View>
                {weeklyTrendDisplay.days.map((day) => (
                  <View
                    key={day.date}
                    className="rounded-2xl border border-muted bg-background p-4">
                    <View className="mb-3 flex-row items-center justify-between">
                      <Text className="w-10 font-semibold text-text">{day.shortLabel}</Text>

                      <Text className="text-sm font-semibold text-accent">
                        {day.adherencePercent}%
                      </Text>
                    </View>

                    <View className="h-3 overflow-hidden rounded-full bg-muted/30">
                      <View
                        className="h-3 rounded-full bg-accent"
                        style={{
                          width: `${day.adherencePercent}%`,
                        }}
                      />
                    </View>

                    <View className="mt-3 flex-row flex-wrap gap-4">
                      <Text className="text-sm text-muted">{day.calories} kcal</Text>
                      <Text className="text-sm text-muted">P {day.protein}g</Text>
                      <Text className="text-sm text-muted">C {day.carbs}g</Text>
                      <Text className="text-sm text-muted">F {day.fats}g</Text>
                    </View>
                  </View>
                ))}
              </View>
            </DashboardSectionCard>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
