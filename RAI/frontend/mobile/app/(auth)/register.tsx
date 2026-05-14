import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthTextInput from 'components/forms/AuthTextInput';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleRegister() {
    // API integration comes in next branch.
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6">
      <View className="flex-1 justify-center">
        <View className="mb-8 items-center">
          <Image source={require('../../assets/icon.png')} className="mb-6 h-20 w-20 rounded-2xl" />

          <Text className="text-4xl font-bold text-text">Create account</Text>

          <Text className="mt-3 text-center text-base text-muted">
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

            <Link href="/(auth)/login" className="font-semibold text-accent">
              Log in
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
