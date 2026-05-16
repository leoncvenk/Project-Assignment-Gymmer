import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import PrimaryButton from 'components/ui/PrimaryButton';

export type ManualFoodFormValues = {
  name: string;
  brand: string;
  calories_per_100g: string;
  protein_g_per_100g: string;
  carbs_g_per_100g: string;
  fat_g_per_100g: string;
};

type ManualFoodFormProps = {
  values: ManualFoodFormValues;
  onChange: (values: ManualFoodFormValues) => void;
  onBack: () => void;
  onCreate: () => void;
};

export default function ManualFoodForm({
  values,
  onChange,
  onBack,
  onCreate,
}: ManualFoodFormProps) {
  function updateField(key: keyof ManualFoodFormValues, value: string) {
    onChange({
      ...values,
      [key]: value,
    });
  }

  return (
    <View>
      <View className="mb-6">
        <Text className="text-2xl font-bold text-text">Create Food</Text>

        <Text className="mt-2 text-sm text-muted">
          Add a food manually when search does not return a match.
        </Text>
      </View>

      <View className="gap-4">
        <TextInput
          value={values.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Food name"
          placeholderTextColor="#c5c5c5"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          value={values.brand}
          onChangeText={(value) => updateField('brand', value)}
          placeholder="Brand"
          placeholderTextColor="#c5c5c5"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          value={values.calories_per_100g}
          onChangeText={(value) => updateField('calories_per_100g', value)}
          placeholder="Calories per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          value={values.protein_g_per_100g}
          onChangeText={(value) => updateField('protein_g_per_100g', value)}
          placeholder="Protein per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          value={values.carbs_g_per_100g}
          onChangeText={(value) => updateField('carbs_g_per_100g', value)}
          placeholder="Carbs per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          value={values.fat_g_per_100g}
          onChangeText={(value) => updateField('fat_g_per_100g', value)}
          placeholder="Fats per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />
      </View>

      <View className="mt-6 gap-4">
        <PrimaryButton title="Create Food" onPress={onCreate} />

        <TouchableOpacity onPress={onBack}>
          <Text className="text-center text-sm font-semibold text-accent">Back to search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
