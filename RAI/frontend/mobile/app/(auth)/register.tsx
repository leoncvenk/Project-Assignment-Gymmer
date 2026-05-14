import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Image, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthTextInput from 'components/forms/AuthTextInput';
import PrimaryButton from 'components/ui/PrimaryButton';

import { register } from 'lib/auth';
import { isAxiosError } from 'axios';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleRegister() {
    if (password !== confirmPassword) {
      Alert.alert('Registration failed', 'Passwords do not match.');
      return;
    }

    try {
      await register({
        username,
        email,
        password,
      });

      router.replace('/(auth)/login');
    } catch (error) {
      if (isAxiosError(error)) {
        console.log('REGISTER ERROR STATUS:', error.response?.status);
        console.log('REGISTER ERROR DATA:', error.response?.data);
        console.log('REGISTER ERROR MESSAGE:', error.message);

        Alert.alert('Registration failed', JSON.stringify(error.response?.data ?? error.message));

        return;
      }

      Alert.alert('Registration failed', 'Unknown error.');
    }
  }

  return (
    <SafeAreaView className="bg-background flex-1 px-6">
      <View className="flex-1 justify-center">
        <View className="mb-8 items-center">
          <Image source={require('../../assets/icon.png')} className="mb-6 h-20 w-20 rounded-2xl" />

          <Text className="text-text text-4xl font-bold">Create account</Text>

          <Text className="text-muted mt-3 text-center text-base">
            Join Gymmer Live and start tracking nutrition and activities.
          </Text>
        </View>

        <View className="rounded-3xl bg-white p-6 shadow-sm">
          <AuthTextInput
            label="Username"
            placeholder="luka"
            value={username}
            onChangeText={setUsername}
          />

          <AuthTextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AuthTextInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AuthTextInput
            label="Confirm password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <PrimaryButton title="Register" onPress={handleRegister} />

          <View className="mt-6 flex-row justify-center">
            <Text className="text-muted">Already have an account? </Text>

            <Link href="/(auth)/login" className="text-accent font-semibold">
              Log in
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
