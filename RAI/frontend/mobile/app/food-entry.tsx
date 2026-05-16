import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import FoodEntrySearchForm from 'components/food-entry/FoodEntrySearchForm';
import ManualFoodForm from 'components/food-entry/ManualFoodForm';
import { createFood, searchFoods } from 'lib/food';
import { Food } from 'types/food';
import { MealType } from 'types/food-entry';
import { createFoodEntry } from 'lib/food-entry';

export default function FoodEntryModal() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantityG, setQuantityG] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCreatingFood, setIsCreatingFood] = useState(false);
  const [manualFood, setManualFood] = useState({
    name: '',
    brand: '',
    calories_per_100g: '',
    protein_g_per_100g: '',
    carbs_g_per_100g: '',
    fat_g_per_100g: '',
  });

  const { mealType } = useLocalSearchParams<{
    mealType: MealType;
  }>();

  async function handleCreateManualFood() {
    const createdFood = await createFood({
      name: manualFood.name,
      brand: manualFood.brand || undefined,
      calories_per_100g: Number(manualFood.calories_per_100g),
      protein_g_per_100g: Number(manualFood.protein_g_per_100g),
      carbs_g_per_100g: Number(manualFood.carbs_g_per_100g),
      fat_g_per_100g: Number(manualFood.fat_g_per_100g),
    });

    setSelectedFood(createdFood);
    setQuery(createdFood.name);
    setIsCreatingFood(false);
  }

  async function handleCreateEntry() {
    if (!selectedFood || !quantityG) {
      return;
    }

    await createFoodEntry({
      food_id: selectedFood.id,
      quantity_g: Number(quantityG),
      meal_type: mealType ?? 'unspecified',
      consumed_at: new Date().toISOString(),
    });

    router.back();
  }

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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="rounded-3xl bg-white p-6 shadow-lg">
            {isCreatingFood ? (
              <ManualFoodForm
                values={manualFood}
                onChange={setManualFood}
                onBack={() => setIsCreatingFood(false)}
                onCreate={handleCreateManualFood}
              />
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
                onCreateEntry={handleCreateEntry}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
