import { Activity, MapPinned, Radio, Smartphone } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function ActivityScreen() {
  function handleStartActivity() {}

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-8"
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
            value="0"
            description="connected"
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
              <Text className="font-semibold text-text">No devices connected</Text>

              <Text className="mt-1 text-sm text-muted">Waiting for MQTT heartbeat messages.</Text>
            </View>
          </DashboardSectionCard>
        </View>

        <PrimaryButton title="Start Activity" onPress={handleStartActivity} />
      </ScrollView>
    </SafeAreaView>
  );
}
