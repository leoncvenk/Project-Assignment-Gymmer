import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Smartphone, Watch, Headphones, HelpCircle } from 'lucide-react-native';

import { getAuthToken } from 'lib/auth';
import { getConnectedDevices, heartbeatCurrentPhone, registerCurrentPhone } from 'lib/devices';

const HEARTBEAT_INTERVAL_MS = 30000;

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'watch':
      return Watch;
    case 'phone':
      return Smartphone;
    case 'headphones':
      return Headphones;
    default:
      return HelpCircle;
  }
};

function DeviceCard({ device }: { device: any }) {
  const Icon = getDeviceIcon(device.device_type);

  return (
    <View className="mb-4 flex-row items-center rounded-3xl border border-muted bg-card p-4">
      <View className="rounded-2xl bg-accent/10 p-3">
        <Icon size={24} color="#00a97f" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-base font-bold text-textOnDark">
          {device.name || 'Unknown phone'}
        </Text>

        <Text className="mt-1 text-sm text-muted">Type: {device.device_type}</Text>

        {device.is_active ? (
          <Text className="mt-1 text-xs font-semibold text-accent">Active</Text>
        ) : (
          <Text className="mt-1 text-xs text-muted">Registered</Text>
        )}

        {device.os_name && (
          <Text className="mt-1 text-xs text-muted">
            OS: {device.os_name} {device.os_version}
          </Text>
        )}

        {device.manufacturer && device.model_name && (
          <Text className="mt-1 text-xs text-muted">
            Model: {device.manufacturer} - {device.model_name}
          </Text>
        )}

        {device.last_connected && (
          <Text className="mt-1 text-xs text-muted">
            Last connected: {new Date(device.last_connected).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function ConnectedDevicesScreen() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    async function refreshDevices(token: string) {
      const data = await getConnectedDevices(token);
      if (isMounted) {
        setDevices(Array.isArray(data) ? data : []);
      }
    }

    async function loadDevices() {
      try {
        const token = await getAuthToken();
        if (!token) return;

        await registerCurrentPhone(token);
        await refreshDevices(token);

        heartbeatInterval = setInterval(async () => {
          try {
            await heartbeatCurrentPhone(token);
            await refreshDevices(token);
          } catch (e: any) {
            console.error('Heartbeat error:', e?.response?.status);
          }
        }, HEARTBEAT_INTERVAL_MS);
      } catch (e: any) {
        console.error('Error loading devices:', e?.response?.status);
        if (isMounted) setDevices([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDevices();

    return () => {
      isMounted = false;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
  }, []);

  const activeDevices = devices.filter((device) => device.is_active);
  const registeredDevices = devices.filter((device) => !device.is_active);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="-ml-2 mr-4 rounded-full bg-card p-2">
          <ArrowLeft size={24} color="#00a97f" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text">Devices</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00a97f" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-6 pt-4">
          <Text className="mb-6 text-muted">Manage your connected devices and status.</Text>

          <Text className="mb-3 text-lg font-bold text-text">Currently Active Devices</Text>
          {activeDevices.length === 0 ? (
            <Text className="mb-6 text-muted">There are currently no active devices.</Text>
          ) : (
            activeDevices.map((device: any) => <DeviceCard key={device.id} device={device} />)
          )}

          <Text className="mb-3 mt-4 text-lg font-bold text-text">Registered Devices</Text>
          {registeredDevices.length === 0 ? (
            <Text className="mt-2 text-muted">No other registered devices.</Text>
          ) : (
            registeredDevices.map((device: any) => <DeviceCard key={device.id} device={device} />)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
