import { useEffect, useState } from 'react';
import { Activity, MapPinned, Radio, Smartphone } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import PrimaryButton from 'components/ui/PrimaryButton';
import { layout } from 'constants/theme';

import { getAuthToken } from 'lib/auth';
import { getConnectedDevices, registerCurrentPhone } from 'lib/devices';

export default function ActivityScreen() {
  const [activeDevices, setActiveDevices] = useState<any[]>([]);

  async function loadActiveDevices() {
    try {
      const token = await getAuthToken();

      if (!token) {
        setActiveDevices([]);
        return;
      }

      // Registrira trenutno napravo kot aktivno
      await registerCurrentPhone(token);

      // Prebere vse naprave trenutnega userja
      const devices = await getConnectedDevices(token);

      const active = Array.isArray(devices) ? devices.filter((device) => device.is_active) : [];

      setActiveDevices(active);
    } catch (error) {
      console.error('Napaka pri nalaganju aktivnih naprav:', error);
      setActiveDevices([]);
    }
  }

  useEffect(() => {
    loadActiveDevices();

    const interval = setInterval(() => {
      loadActiveDevices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  function handleStartActivity() {
    loadActiveDevices();
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
            value="Offline"
            description="broker"
            icon={<Radio size={20} color="#00a97f" />}
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
            value={`${activeDevices.length}`}
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
            subtitle="Heartbeat and device state will be shown here.">
            <View className="rounded-2xl border border-muted bg-background p-4">
              {activeDevices.length === 0 ? (
                <View>
                  <Text className="font-semibold text-text">No active devices connected</Text>

                  <Text className="mt-1 text-sm text-muted">
                    Waiting for active device heartbeat.
                  </Text>
                </View>
              ) : (
                <View>
                  <Text className="mb-3 font-semibold text-text">
                    {activeDevices.length} active device
                    {activeDevices.length === 1 ? '' : 's'} connected
                  </Text>

                  {activeDevices.map((device) => (
                    <View
                      key={device.id}
                      className="mb-3 rounded-xl border border-muted bg-white p-3">
                      <Text className="font-semibold text-text">
                        {device.name || 'Unknown device'}
                      </Text>

                      <Text className="mt-1 text-sm text-muted">Tip: {device.device_type}</Text>

                      {device.os_name ? (
                        <Text className="mt-1 text-xs text-muted">
                          OS: {device.os_name} {device.os_version}
                        </Text>
                      ) : null}

                      {device.last_connected ? (
                        <Text className="mt-1 text-xs text-muted">
                          Zadnja povezava: {new Date(device.last_connected).toLocaleString()}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              )}
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
