import { useEffect, useState } from 'react';
import { View, Text, Alert, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MapPin, ArrowLeft, Settings } from 'lucide-react-native';
import { router } from 'expo-router';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function PermissionsScreen() {
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    setStatus(status);
    setCanAskAgain(canAskAgain);
  }

  async function handleRequestPermission() {
    if (status === Location.PermissionStatus.GRANTED) {
      Alert.alert('All Set', 'The app already has location access.');
      return;
    }

    if (!canAskAgain) {
      Alert.alert(
        'Permission Denied',
        'You have permanently denied location access. You must open your phone settings to enable it.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    const response = await Location.requestForegroundPermissionsAsync();
    setStatus(response.status);
    setCanAskAgain(response.canAskAgain);

    if (response.status === Location.PermissionStatus.GRANTED) {
      Alert.alert('Success', 'Location access granted. Activity tracking will now work.');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="-ml-2 mr-4 rounded-full bg-card p-2">
          <ArrowLeft size={24} color="#00a97f" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text">Permissions</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <View className="mb-6">
          <DashboardSectionCard
            title="Location Access"
            subtitle="Required for drawing routes and tracking your movement.">
            <View className="items-center justify-center rounded-3xl border border-muted bg-card p-6">
              <View
                className={`mb-4 h-20 w-20 items-center justify-center rounded-full ${status === 'granted' ? 'bg-accent/20' : 'bg-muted/30'}`}>
                <MapPin size={40} color={status === 'granted' ? '#00a97f' : '#64748b'} />
              </View>

              <Text className="mb-2 text-xl font-bold text-textOnDark">
                {status === 'granted' ? 'Access Granted' : 'Access Denied'}
              </Text>

              <Text className="mb-6 text-center text-sm text-muted">
                {status === 'granted'
                  ? 'Gymmer has access to your GPS signal. Activity tracking will function normally.'
                  : 'Without location access, the app cannot draw your route on the map.'}
              </Text>

              <PrimaryButton
                title={status === 'granted' ? 'Manage in Settings' : 'Enable Location'}
                onPress={
                  status === 'granted' ? () => Linking.openSettings() : handleRequestPermission
                }
                variant={status === 'granted' ? 'secondary' : 'default'}
              />
            </View>
          </DashboardSectionCard>
        </View>
      </View>
    </SafeAreaView>
  );
}
