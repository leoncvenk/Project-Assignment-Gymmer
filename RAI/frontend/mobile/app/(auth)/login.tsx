import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Image, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser, login, saveAuthToken } from 'lib/auth';
import { isAxiosError } from 'axios';

import AuthTextInput from 'components/forms/AuthTextInput';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const loginResponse = await login({
        email,
        password,
      });

      await saveAuthToken(loginResponse.access_token);

      const user = await getCurrentUser(loginResponse.access_token);

      console.log('CURRENT USER:', user);
      console.log('PROFILE COMPLETED:', user.profile_completed);

      if (user.profile_completed) {
        router.replace('/(app)/dashboard');
        return;
      }

      router.replace('/(auth)/profile-setup');
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert('Login failed', JSON.stringify(error.response?.data ?? error.message));
        return;
      }

      Alert.alert('Login failed', 'Unknown error.');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="flex-1 justify-center">
        <View className="mb-10 items-center">
          <Image source={require('../../assets/icon.png')} className="mb-6 h-20 w-20 rounded-2xl" />

          <Text className="text-4xl font-bold text-text">Welcome back</Text>

          <Text className="mt-3 text-center text-base text-muted">
            Sign in to continue tracking your nutrition and live activities.
          </Text>
        </View>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <AuthTextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AuthTextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <PrimaryButton title="Log in" onPress={handleLogin} />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-muted">Don&apos;t have an account? </Text>

            <Link href="/(auth)/register" className="font-semibold text-accent">
              Register
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
