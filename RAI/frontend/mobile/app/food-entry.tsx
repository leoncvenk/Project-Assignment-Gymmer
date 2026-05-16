import { router, useLocalSearchParams } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import PrimaryButton from 'components/ui/PrimaryButton';
import { MealType } from 'types/food-entry';
import { ScanBarcode } from 'lucide-react-native';

function formatMealType(mealType: string) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export default function FoodEntryModal() {
  const { mealType } = useLocalSearchParams<{
    mealType: MealType;
  }>();

  return (
    <View className="flex-1 justify-center bg-black/40 px-4 pb-8">
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => router.back()}
        className="absolute inset-0"
      />

      <View className="rounded-3xl bg-white p-6 shadow-lg">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-text">Add Food Entry</Text>

          <Text className="mt-2 text-sm text-muted">
            Logging for {formatMealType(mealType ?? 'unspecified')}
          </Text>
        </View>

        <View className="mb-5">
          <Text className="mb-2 text-sm font-medium text-text">Search Food</Text>

          <TextInput
            placeholder="Chicken breast..."
            placeholderTextColor="#c5c5c5"
            className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
          />
        </View>

        <View className="mb-5 gap-3">
          <TouchableOpacity
            onPress={() => {}}
            className="flex-row items-center justify-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-4 active:bg-accent/20">
            <ScanBarcode size={20} color="#00a97f" />
            <Text className="text-center text-sm font-semibold text-accent">Scan barcode</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Text className="text-center text-sm font-semibold text-accent">
              Can&apos;t find it? Create food manually
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-text">Quantity (g)</Text>

          <TextInput
            placeholder="100"
            placeholderTextColor="#c5c5c5"
            keyboardType="numeric"
            className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
          />
        </View>

        <PrimaryButton title="Create Entry" onPress={() => {}} />
      </View>
    </View>
  );
}
