import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type ManualFoodFormProps = {
  onBack: () => void;
};

export default function ManualFoodForm({ onBack }: ManualFoodFormProps) {
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
          placeholder="Food name"
          placeholderTextColor="#c5c5c5"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          placeholder="Brand"
          placeholderTextColor="#c5c5c5"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          placeholder="Calories per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          placeholder="Protein per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          placeholder="Carbs per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />

        <TextInput
          placeholder="Fats per 100g"
          placeholderTextColor="#c5c5c5"
          keyboardType="numeric"
          className="rounded-xl border border-muted bg-background px-4 py-4 text-text"
        />
      </View>

      <TouchableOpacity onPress={onBack} className="mt-6">
        <Text className="text-center text-sm font-semibold text-accent">Back to search</Text>
      </TouchableOpacity>
    </View>
  );
}
