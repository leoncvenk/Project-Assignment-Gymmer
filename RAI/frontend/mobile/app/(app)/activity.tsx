import { useEffect, useState, useRef } from 'react';
import { Activity, MapPinned, Radio, Smartphone } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import PrimaryButton from 'components/ui/PrimaryButton';
import { layout } from 'constants/theme';

import { getAuthToken, getCurrentUser } from 'lib/auth';
import { connectMqtt, sendHeartbeat, disconnectMqtt } from 'lib/mqtt';

export default function ActivityScreen() {
  const [mqttConnected, setMqttConnected] = useState(false);
  const [activeDevicesCount, setActiveDevicesCount] = useState(0);
  const [userId, setUserId] = useState<string>('Loading...');
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  // Reliable unique device ID generation on startup
  const deviceId = useRef(`device_${Math.random().toString(16).slice(2, 8)}`).current;

  useEffect(() => {
    let isMounted = true;
    let countInterval: NodeJS.Timeout;

    // Asynchronous initialization function
    const initializeLiveActivity = async () => {
      try {
        const token = await getAuthToken();
        if (!token) return;

        // STEP 1: Get current user from API
        const user = await getCurrentUser(token);

        const currentUserId = (user as any).id || 'unknown_user';

        if (isMounted) {
          setUserId(currentUserId);
        }

        // STEP 2: Connect to MQTT only after we have the User ID
        connectMqtt(
          currentUserId,
          deviceId,
          () => {
            if (isMounted) setMqttConnected(true);

            // First heartbeat
            sendHeartbeat(currentUserId, deviceId);

            // Regular heartbeat
            heartbeatInterval.current = setInterval(() => {
              sendHeartbeat(currentUserId, deviceId);
            }, 30000);
          },
          (message) => {
            console.log('MQTT message received:', message.payloadString);
          }
        );

        // STEP 3: API call for active devices count
        const fetchActiveCount = async () => {
          try {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/api/users/me/devices/active-count`;
            const res = await fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true',
                'Bypass-Tunnel-Reminder': 'true',
              },
            });

            if (!res.ok) {
              console.log(
                `API currently unreachable (Status: ${res.status}). Waiting for next interval...`
              );
              return;
            }

            const rawText = await res.text();
            const data = JSON.parse(rawText);

            if (isMounted) {
              setActiveDevicesCount(data.active_devices || 0);
            }
          } catch (error: any) {
            console.log('Silent error fetching data:', error.message);
          }
        };

        // Run immediately and then every 15 seconds
        fetchActiveCount();
        countInterval = setInterval(fetchActiveCount, 15000);
      } catch (error) {
        console.error('Error initializing Live Activity:', error);
      }
    };

    initializeLiveActivity();

    return () => {
      isMounted = false;
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
      if (countInterval) clearInterval(countInterval);
      disconnectMqtt();
    };
  }, [deviceId]);

  function handleStartActivity() {
    console.log('Activity started (TODO: publish location to MQTT)');
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-8"
        contentContainerStyle={{
          paddingTop: 32,
          paddingBottom: layout.floatingTabBarSafePadding + 140,
        }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-4xl font-bold text-text">Live Activity</Text>

          <Text className="mt-3 text-base text-muted">
            Track real-time movement, GPS location, and connected devices.
          </Text>
        </View>

        <View className="mb-4 flex-row gap-4">
          <DashboardStatCard
            title="Activity"
            value="Idle"
            description="no session"
            icon={<Activity size={20} color="#00a97f" />}
          />

          <DashboardStatCard
            title="MQTT"
            value={mqttConnected ? 'Online' : 'Offline'}
            description="broker"
            icon={<Radio size={20} color={mqttConnected ? '#00a97f' : '#ef4444'} />}
          />
        </View>

        <View className="mb-8 flex-row gap-4">
          <DashboardStatCard
            title="GPS"
            value="Waiting"
            description="no signal"
            icon={<MapPinned size={20} color="#00a97f" />}
          />

          <DashboardStatCard
            title="Devices"
            value={`${activeDevicesCount}`}
            description="active"
            icon={<Smartphone size={20} color="#00a97f" />}
          />
        </View>

        <View className="mb-6">
          <DashboardSectionCard
            title="Live Route"
            subtitle="Real-time route tracking will appear here.">
            <View className="h-56 items-center justify-center rounded-3xl bg-card">
              <MapPinned size={42} color="#00a97f" />

              <Text className="mt-4 text-lg font-semibold text-textOnDark">No active route</Text>

              <Text className="mt-2 text-center text-sm text-muted">
                Start an activity to begin GPS tracking.
              </Text>
            </View>
          </DashboardSectionCard>
        </View>

        <View className="mb-8">
          <DashboardSectionCard
            title="Connected Devices"
            subtitle="Heartbeat and device state are shown here.">
            <View className="rounded-2xl border border-muted bg-background p-4">
              <Text className="mb-3 font-semibold text-text">
                Currently active devices (Live): {activeDevicesCount}
              </Text>
              <Text className="mt-1 text-sm text-muted">
                The system automatically counts devices via MQTT heartbeat and Last Will mechanism,
                without database overhead.
              </Text>
              <Text className="mt-3 text-xs text-muted/60">User ID: {userId}</Text>
            </View>
          </DashboardSectionCard>
        </View>

        <View className="mb-8">
          <PrimaryButton title="Start Activity" onPress={handleStartActivity} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
