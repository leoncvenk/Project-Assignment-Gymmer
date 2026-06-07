import { Activity, MapPinned, Radio, Smartphone, Footprints } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import PrimaryButton from 'components/ui/PrimaryButton';
import { layout } from 'constants/theme';
import { useGlobalData } from './_layout';
import { useStepCounter } from 'lib/step-counter';

export default function ActivityScreen() {
  const { mqttConnected, activeDevicesCount, userId } = useGlobalData();
  
  // Initialize the custom step counter hook
  const steps = useStepCounter();

  function handleStartActivity() {
    console.log('Activity started');
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

        {/* Step Counter Pill */}
        <View className="mb-6 flex-row">
          <View className="flex-row items-center gap-3 rounded-full border border-accent bg-accent/10 px-4 py-2">
            <Footprints size={20} color="#00a97f" />
            <Text className="font-semibold text-text">
              {steps} steps today
            </Text>
          </View>
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
                Currently active devices: {activeDevicesCount}
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