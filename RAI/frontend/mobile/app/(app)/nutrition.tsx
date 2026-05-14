import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';

const meals = [
  {
    title: 'Breakfast',
    calories: 420,
    protein: 28,
    carbs: 42,
    fats: 14,
  },
  {
    title: 'Lunch',
    calories: 680,
    protein: 52,
    carbs: 58,
    fats: 20,
  },
  {
    title: 'Dinner',
    calories: 520,
    protein: 40,
    carbs: 48,
    fats: 16,
  },
  {
    title: 'Snacks',
    calories: 220,
    protein: 12,
    carbs: 18,
    fats: 8,
  },
];

export default function NutritionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-8"
        showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-4xl font-bold text-text">Today&apos;s Nutrition</Text>

          <Text className="mt-3 text-base text-muted">
            Track your daily calorie and macro progress.
          </Text>
        </View>

        <View className="mb-6 flex-row gap-4">
          <DashboardStatCard title="Calories" value="1840" description="/ 2200 kcal" />

          <DashboardStatCard title="Protein" value="132g" description="/ 180g" />
        </View>

        <View className="mb-8 flex-row gap-4">
          <DashboardStatCard title="Carbs" value="165g" description="/ 250g" />

          <DashboardStatCard title="Fats" value="54g" description="/ 70g" />
        </View>

        <DashboardSectionCard title="Meals" subtitle="Today's logged meals and nutrition totals.">
          <View className="gap-4">
            {meals.map((meal) => (
              <View key={meal.title} className="rounded-2xl border border-muted bg-background p-4">
                <Text className="text-lg font-semibold text-text">{meal.title}</Text>

                <View className="mt-3 flex-row flex-wrap gap-4">
                  <Text className="text-sm text-muted">{meal.calories} kcal</Text>

                  <Text className="text-sm text-muted">P {meal.protein}g</Text>

                  <Text className="text-sm text-muted">C {meal.carbs}g</Text>

                  <Text className="text-sm text-muted">F {meal.fats}g</Text>
                </View>
              </View>
            ))}
          </View>
        </DashboardSectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}
