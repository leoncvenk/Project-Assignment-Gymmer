import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import FoodEntrySearchForm from 'components/food-entry/FoodEntrySearchForm';
import ManualFoodForm from 'components/food-entry/ManualFoodForm';
import { searchFoods } from 'lib/food';
import { Food } from 'types/food';
import { MealType } from 'types/food-entry';

export default function FoodEntryModal() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantityG, setQuantityG] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingFood, setIsCreatingFood] = useState(false);

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
        {isCreatingFood ? (
          <ManualFoodForm onBack={() => setIsCreatingFood(false)} />
        ) : (
          <FoodEntrySearchForm
            mealType={mealType ?? 'unspecified'}
            query={query}
            foods={foods}
            selectedFood={selectedFood}
            quantityG={quantityG}
            isSearching={isSearching}
            showFallbackActions={showFallbackActions}
            onQueryChange={(value) => {
              setQuery(value);
              setSelectedFood(null);
            }}
            onSelectFood={(food) => {
              setSelectedFood(food);
              setQuery(food.name);
              setFoods([]);
            }}
            onQuantityChange={setQuantityG}
            onScanBarcode={() => {}}
            onCreateFoodManually={() => setIsCreatingFood(true)}
            onCreateEntry={() => {}}
          />
        )}
      </View>
    </View>
  );
}
