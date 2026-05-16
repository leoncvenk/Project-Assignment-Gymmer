import { router, useLocalSearchParams } from 'expo-router';
import { ScanBarcode } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import PrimaryButton from 'components/ui/PrimaryButton';
import { searchFoods } from 'lib/food';
import { Food } from 'types/food';
import { MealType } from 'types/food-entry';

function formatMealType(mealType: string) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export default function FoodEntryModal() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantityG, setQuantityG] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { mealType } = useLocalSearchParams<{
    mealType: MealType;
  }>();

  useEffect(() => {
    if (selectedFood) {
      return;
    }

    if (query.trim().length < 2) {
      setFoods([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);

        const results = await searchFoods({
          query: query.trim(),
          limit: 8,
          skip: 0,
        });

        setFoods(results);
      } catch {
        setFoods([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, selectedFood]);

  const showFallbackActions =
    query.trim().length >= 2 && !isSearching && foods.length === 0 && !selectedFood;

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
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setSelectedFood(null);
            }}
            placeholder="Chicken breast..."
            placeholderTextColor="#c5c5c5"
            className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
          />

          <View className="mt-3 gap-2">
            {isSearching ? <Text className="text-sm text-muted">Searching...</Text> : null}

            {foods.map((food) => (
              <TouchableOpacity
                key={food.id}
                onPress={() => {
                  setSelectedFood(food);
                  setQuery(food.name);
                  setFoods([]);
                }}
                className="rounded-xl border border-muted bg-background p-4 active:bg-accent/10">
                <Text className="font-semibold text-text">{food.name}</Text>

                <Text className="mt-1 text-sm text-muted">{food.brand ?? 'Unknown brand'}</Text>

                <Text className="mt-2 text-xs text-muted">
                  {food.calories_per_100g ?? 0} kcal · P {food.protein_g_per_100g ?? 0}g · C{' '}
                  {food.carbs_g_per_100g ?? 0}g · F {food.fat_g_per_100g ?? 0}g / 100g
                </Text>
              </TouchableOpacity>
            ))}

            {showFallbackActions ? (
              <Text className="text-sm text-muted">No foods found.</Text>
            ) : null}
          </View>
        </View>

        {showFallbackActions ? (
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
        ) : null}

        {selectedFood ? (
          <View className="mb-5 rounded-xl border border-accent bg-accent/10 p-4">
            <Text className="text-sm font-semibold text-accent">Selected food</Text>
            <Text className="mt-1 text-base font-semibold text-text">{selectedFood.name}</Text>
            <Text className="mt-1 text-sm text-muted">{selectedFood.brand ?? 'Unknown brand'}</Text>
          </View>
        ) : null}

        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-text">Quantity (g)</Text>

          <TextInput
            value={quantityG}
            onChangeText={setQuantityG}
            editable={!!selectedFood}
            placeholder={selectedFood ? '100' : 'Select a food first'}
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
