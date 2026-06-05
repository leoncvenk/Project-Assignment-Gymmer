import { Camera, ImagePlus, ScanBarcode } from 'lucide-react-native';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import PrimaryButton from 'components/ui/PrimaryButton';
import { Food } from 'types/food';
import { MealType } from 'types/food-entry';

type FoodEntrySearchFormProps = {
  mealType: MealType;
  query: string;
  foods: Food[];
  selectedFood: Food | null;
  quantityG: string;
  isSearching: boolean;
  showFallbackActions: boolean;
  isRecognizingFood: boolean;
  onQueryChange: (value: string) => void;
  onSelectFood: (food: Food) => void;
  onQuantityChange: (value: string) => void;
  onScanBarcode: () => void;
  onCreateFoodManually: () => void;
  onCreateEntry: () => void;
  onPickFoodImage: () => void;
  onTakeFoodPhoto: () => void;
};

function formatMealType(mealType: string) {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}

export default function FoodEntrySearchForm({
  mealType,
  query,
  foods,
  selectedFood,
  quantityG,
  isSearching,
  isRecognizingFood,
  showFallbackActions,
  onQueryChange,
  onSelectFood,
  onQuantityChange,
  onScanBarcode,
  onCreateFoodManually,
  onCreateEntry,
  onPickFoodImage,
  onTakeFoodPhoto,
}: FoodEntrySearchFormProps) {
  return (
    <View>
      <View className="mb-6">
        <Text className="text-2xl font-bold text-text">Add Food Entry</Text>

        <Text className="mt-2 text-sm text-muted">Logging for {formatMealType(mealType)}</Text>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-text">Search Food</Text>

        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Chicken breast..."
          placeholderTextColor="#c5c5c5"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <View className="mt-3 flex-col gap-3">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onPickFoodImage}
              disabled={isRecognizingFood}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-3 active:bg-accent/20">
              <ImagePlus size={18} color="#00a97f" />
              <Text className="text-sm font-semibold text-accent">
                {isRecognizingFood ? 'Recognizing...' : 'Gallery'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onTakeFoodPhoto}
              disabled={isRecognizingFood}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-3 active:bg-accent/20">
              <Camera size={18} color="#00a97f" />
              <Text className="text-sm font-semibold text-accent">Camera</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={onScanBarcode}
              className="flex-row items-center justify-center gap-2 rounded-xl border border-accent bg-accent/10 px-4 py-4 active:bg-accent/20">
              <ScanBarcode size={20} color="#00a97f" />
              <Text className="text-center text-sm font-semibold text-accent">Scan barcode</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-3 gap-2">
          {isSearching ? <Text className="text-sm text-muted">Searching...</Text> : null}

          {foods.map((food) => (
            <TouchableOpacity
              key={food.id}
              onPress={() => onSelectFood(food)}
              className="rounded-xl border border-muted bg-background p-4 active:bg-accent/10">
              <Text className="font-semibold text-text">{food.name}</Text>

              <Text className="mt-1 text-sm text-muted">{food.brand ?? 'Unknown brand'}</Text>

              <Text className="mt-2 text-xs text-muted">
                {food.calories_per_100g ?? 0} kcal · P {food.protein_g_per_100g ?? 0}g · C{' '}
                {food.carbs_g_per_100g ?? 0}g · F {food.fat_g_per_100g ?? 0}g / 100g
              </Text>
            </TouchableOpacity>
          ))}

          {showFallbackActions ? <Text className="text-sm text-muted">No foods found.</Text> : null}
        </View>
      </View>

      {showFallbackActions ? (
        <View className="mb-5 gap-3">
          <TouchableOpacity onPress={onCreateFoodManually}>
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
          onChangeText={onQuantityChange}
          editable={!!selectedFood}
          placeholder={selectedFood ? '100' : 'Select a food first'}
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />
      </View>

      <PrimaryButton title="Create Entry" onPress={onCreateEntry} />
    </View>
  );
}
