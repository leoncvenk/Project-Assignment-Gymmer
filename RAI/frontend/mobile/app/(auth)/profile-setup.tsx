import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthTextInput from 'components/forms/AuthTextInput';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function ProfileSetupScreen() {
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [goalWeightKg, setGoalWeightKg] = useState('');
  const [age, setAge] = useState('');

  function handleSubmit() {}

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-8"
        showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-4xl font-bold text-text">Complete profile</Text>
          <Text className="mt-3 text-base text-muted">
            Add your body stats so Gymmer can calculate your nutrition targets.
          </Text>
        </View>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <AuthTextInput
            label="Height"
            placeholder="180"
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="default"
          />

          <AuthTextInput
            label="Weight"
            placeholder="85"
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="default"
          />

          <AuthTextInput
            label="Goal weight"
            placeholder="79"
            value={goalWeightKg}
            onChangeText={setGoalWeightKg}
            keyboardType="default"
          />

          <AuthTextInput
            label="Age"
            placeholder="22"
            value={age}
            onChangeText={setAge}
            keyboardType="default"
          />

          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-text">Sex</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-xl border border-muted bg-card px-4 py-4">
                <Text className="text-center font-semibold text-textOnDark">Male</Text>
              </View>

              <View className="flex-1 rounded-xl border border-muted bg-white px-4 py-4">
                <Text className="text-center font-semibold text-text">Female</Text>
              </View>
            </View>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-text">Activity Level</Text>

            <View className="gap-3">
              {['Sedentary', 'Light', 'Moderate', 'Active', 'Very active'].map((level) => (
                <View key={level} className="rounded-xl border border-muted bg-white px-4 py-4">
                  <Text className="font-medium text-text">{level}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-text">Goal</Text>

            <View className="gap-3">
              {['Lose weight', 'Maintain weight', 'Gain weight'].map((goal) => (
                <View key={goal} className="rounded-xl border border-muted bg-white px-4 py-4">
                  <Text className="font-medium text-text">{goal}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <PrimaryButton title="Complete profile" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
