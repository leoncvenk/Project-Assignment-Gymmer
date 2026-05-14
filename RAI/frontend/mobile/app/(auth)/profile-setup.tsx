import { isAxiosError } from 'axios';
import { useState } from 'react';
import { router } from 'expo-router';
import { Alert, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthTextInput from 'components/forms/AuthTextInput';
import PrimaryButton from 'components/ui/PrimaryButton';
import { getAuthToken } from 'lib/auth';
import { createProfile } from 'lib/profile';
import { ActivityLevel, GoalType, Sex } from 'types/profile';

export default function ProfileSetupScreen() {
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [goalWeightKg, setGoalWeightKg] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goalType, setGoalType] = useState<GoalType>('lose_weight');

  const activityOptions: { label: string; value: ActivityLevel }[] = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Active', value: 'active' },
    { label: 'Very active', value: 'very_active' },
  ];

  const goalOptions: { label: string; value: GoalType }[] = [
    { label: 'Lose weight', value: 'lose_weight' },
    { label: 'Maintain weight', value: 'maintain_weight' },
    { label: 'Gain weight', value: 'gain_weight' },
  ];

  async function handleSubmit() {
    if (!heightCm || !weightKg || !goalWeightKg || !age) {
      Alert.alert('Missing fields', 'Fill in all profile fields.');
      return;
    }

    const token = await getAuthToken();

    if (!token) {
      Alert.alert('Auth error', 'Missing authentication token.');
      return;
    }

    try {
      await createProfile(token, {
        age: Number(age),
        sex,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        goal_weight_kg: Number(goalWeightKg),
        activity_level: activityLevel,
        goal_type: goalType,
      });

      router.replace('/(app)/dashboard');
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert('Profile setup failed', JSON.stringify(error.response?.data ?? error.message));
        return;
      }

      Alert.alert('Profile setup failed', 'Unknown error.');
    }
  }

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
              <TouchableOpacity
                onPress={() => setSex('male')}
                className={`flex-1 rounded-xl border px-4 py-4 ${sex === 'male' ? 'border-accent bg-card' : 'border-muted bg-white'}`}>
                <Text
                  className={`text-center font-semibold ${sex === 'male' ? 'text-textOnDark' : 'text-text'}`}>
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSex('female')}
                className={`flex-1 rounded-xl border px-4 py-4 ${sex === 'female' ? 'border-accent bg-card' : 'border-muted bg-white'}`}>
                <Text
                  className={`text-center font-semibold ${sex === 'female' ? 'text-textOnDark' : 'text-text'}`}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-text">Activity Level</Text>

            <View className="gap-3">
              {activityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setActivityLevel(option.value)}
                  className={`rounded-xl border px-4 py-4 ${
                    activityLevel === option.value
                      ? 'border-accent bg-card'
                      : 'border-muted bg-white'
                  }`}>
                  <Text
                    className={`font-medium ${
                      activityLevel === option.value ? 'text-textOnDark' : 'text-text'
                    }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-text">Goal</Text>

            <View className="gap-3">
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setGoalType(option.value)}
                  className={`rounded-xl border px-4 py-4 ${goalType === option.value ? 'border-accent bg-card' : 'border-muted bg-white'}`}>
                  <Text
                    className={`font-medium ${goalType === option.value ? 'text-textOnDark' : 'text-text'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <PrimaryButton title="Complete profile" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
