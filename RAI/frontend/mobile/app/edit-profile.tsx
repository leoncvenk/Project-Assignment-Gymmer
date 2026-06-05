import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { isAxiosError } from 'axios';

import AuthTextInput from 'components/forms/AuthTextInput';
import PrimaryButton from 'components/ui/PrimaryButton';
import { getAuthToken } from 'lib/auth';
import { getProfile, updateProfile } from 'lib/profile'; 
import { ActivityLevel, GoalType, Sex } from 'types/profile';

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);

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

  // Ob odprtju zaslona potegnemo tvoje obstoječe podatke
  useEffect(() => {
    async function fetchCurrentProfile() {
      try {
        const token = await getAuthToken();
        if (!token) return;

        const profileData = await getProfile(token);
        
        // Polja se napolnijo s trenutnimi podatki
        setHeightCm(profileData.height_cm?.toString() || '');
        setWeightKg(profileData.weight_kg?.toString() || '');
        setGoalWeightKg(profileData.goal_weight_kg?.toString() || '');
        setAge(profileData.age?.toString() || '');
        setSex(profileData.sex || 'male');
        setActivityLevel(profileData.activity_level || 'moderate');
        setGoalType(profileData.goal_type || 'lose_weight');

      } catch (error) {
        console.error('Napaka pri nalaganju podatkov profila:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentProfile();
  }, []);

async function handleSave() {
    if (!heightCm || !weightKg || !goalWeightKg || !age) {
      Alert.alert('Missing fields', 'Fill in all profile fields.');
      return;
    }

    const token = await getAuthToken();
    if (!token) return;

    try {
      const data = {
        age: Number(age),
        sex,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        goal_weight_kg: Number(goalWeightKg),
        activity_level: activityLevel,
        goal_type: goalType,
      };
      
      console.log("Pošiljam podatke:", data); 
      
      await updateProfile(token, data);
      router.back();
    } catch (error: any) {
      console.log("PODROBNA NAPAKA:", error);
      
      if (isAxiosError(error)) {
        Alert.alert('Update failed', JSON.stringify(error.response?.data ?? error.message));
      } else {
        Alert.alert('Update failed', error.message || 'Unknown error.');
      }
    }
  }
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#00a97f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-4">
        <ArrowLeft 
          size={24} 
          color="#f2f2f2" 
          onPress={() => router.back()} 
        />
        <Text className="ml-4 text-xl font-bold text-text">Edit Profile</Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-4"
        showsVerticalScrollIndicator={false}>
        
        <View className="mb-6">
          <Text className="text-base text-muted">
            Update your body stats to recalculate your nutrition targets.
          </Text>
        </View>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <AuthTextInput
            label="Height (cm)"
            placeholder="180"
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="numeric"
          />

          <AuthTextInput
            label="Weight (kg)"
            placeholder="85"
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="numeric"
          />

          <AuthTextInput
            label="Goal weight (kg)"
            placeholder="79"
            value={goalWeightKg}
            onChangeText={setGoalWeightKg}
            keyboardType="numeric"
          />

          <AuthTextInput
            label="Age"
            placeholder="22"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <View className="mb-5">
            <Text className="mb-2 text-sm font-medium text-text">Sex</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setSex('male')}
                className={`flex-1 rounded-xl border px-4 py-4 ${sex === 'male' ? 'border-accent bg-card' : 'border-muted bg-white'}`}>
                <Text className={`text-center font-semibold ${sex === 'male' ? 'text-textOnDark' : 'text-text'}`}>Male</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSex('female')}
                className={`flex-1 rounded-xl border px-4 py-4 ${sex === 'female' ? 'border-accent bg-card' : 'border-muted bg-white'}`}>
                <Text className={`text-center font-semibold ${sex === 'female' ? 'text-textOnDark' : 'text-text'}`}>Female</Text>
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
                    activityLevel === option.value ? 'border-accent bg-card' : 'border-muted bg-white'
                  }`}>
                  <Text className={`font-medium ${activityLevel === option.value ? 'text-textOnDark' : 'text-text'}`}>
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
                  <Text className={`font-medium ${goalType === option.value ? 'text-textOnDark' : 'text-text'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* GUMBI NA DNU (Shrani in Prekliči) */}
        <View className="mb-10 mt-6 gap-3">
          <PrimaryButton title="Save changes" onPress={handleSave} />
          
<TouchableOpacity 
            onPress={() => router.back()} 
            className="rounded-2xl border border-sidebar bg-sidebar py-4">
            <Text className="text-center text-base font-semibold text-white">
              Cancel without saving
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}