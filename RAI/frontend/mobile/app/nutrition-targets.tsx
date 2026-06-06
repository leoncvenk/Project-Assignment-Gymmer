// RAI/frontend/mobile/app/nutrition-targets.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { fetchNutritionTargets, updateNutritionTargets } from 'lib/nutrition';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function NutritionTargetsScreen() {
  const [targets, setTargets] = useState<any>({
    calorie_target: 0,
    protein_target_g: 0,
    carbs_target_g: 0,
    fat_target_g: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNutritionTargets();
        if (data) {
          setTargets({
            calorie_target: data.calorie_target || 0,
            protein_target_g: data.protein_target_g || 0,
            carbs_target_g: data.carbs_target_g || 0,
            fat_target_g: data.fat_target_g || 0,
          });
        }
      } catch (e) {
        console.error('Napaka pri nalaganju:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setLoading(true);
    try {
      await updateNutritionTargets(targets);
      router.back();
    } catch (e) {
      console.error('Napaka pri shranjevanju:', e);
      alert('Shranjevanje ni uspelo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-4">
        <ArrowLeft size={24} color="#f2f2f2" onPress={() => router.back()} />
        <Text className="ml-4 text-xl font-bold text-text">Nutrition Targets</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00a97f" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6">
          <Text className="mb-6 text-muted">Set your daily macro goals.</Text>

          <View className="gap-4 rounded-3xl bg-card p-6">
            {[
              { key: 'calorie_target', label: 'Daily Calories' },
              { key: 'protein_target_g', label: 'Protein (g)' },
              { key: 'carbs_target_g', label: 'Carbs (g)' },
              { key: 'fat_target_g', label: 'Fats (g)' },
            ].map((field) => (
              <View key={field.key}>
                <Text className="mb-2 font-semibold text-textOnDark">{field.label}</Text>
                <TextInput
                  className="rounded-xl border border-muted bg-sidebar p-4 text-textOnDark"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={targets[field.key]?.toString()}
                  onChangeText={(val) =>
                    setTargets({ ...targets, [field.key]: parseInt(val) || 0 })
                  }
                />
              </View>
            ))}
          </View>

          <View className="mb-10 mt-8 gap-3">
            <PrimaryButton title="Save Changes" onPress={handleSave} />

            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center rounded-2xl border border-muted bg-sidebar py-4">
              <Text className="font-bold text-textOnDark">Cancel without saving</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
