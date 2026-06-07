import { Activity, MapPinned, Radio, Smartphone, Footprints } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useState, useEffect } from 'react';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import DashboardStatCard from 'components/cards/DashboardStatCard';
import PrimaryButton from 'components/ui/PrimaryButton';
import { layout } from 'constants/theme';
import { useGlobalData } from './_layout';
import { useStepCounter } from 'lib/step-counter';
import { useLocationTracker } from 'lib/location-tracker';
import { syncActivityData, fetchActivityData } from 'lib/activity';

function calculateDistance(points: { latitude: number; longitude: number }[]) {
  let distance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const lat1 = points[i].latitude;
    const lon1 = points[i].longitude;
    const lat2 = points[i + 1].latitude;
    const lon2 = points[i + 1].longitude;
    distance += Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111000;
  }
  return distance;
}

export default function ActivityScreen() {
  const { mqttConnected, activeDevicesCount, userId } = useGlobalData();
  const localSteps = useStepCounter();
  const [serverSteps, setServerSteps] = useState(0);

  const { isTracking, currentLocation, route, startTracking, stopTracking } = useLocationTracker();

  useEffect(() => {
    async function loadInitialData() {
      const data = await fetchActivityData();
      if (data) setServerSteps(data.steps);
    }
    loadInitialData();
  }, []);

  async function handleToggleActivity() {
    if (isTracking) {
      stopTracking();
      console.log('Activity stopped. Route length:', route.length);

      const distance = calculateDistance(route);
      const updatedData = await syncActivityData(localSteps, distance, 0);
      if (updatedData) setServerSteps(updatedData.steps);
    } else {
      startTracking();
      console.log('Activity started');
    }
  }

  const displaySteps = Math.max(localSteps, serverSteps);

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
            <Text className="font-semibold text-text">{displaySteps} steps today</Text>
          </View>
        </View>

        <View className="mb-4 flex-row gap-4">
          <DashboardStatCard
            title="Activity"
            value={isTracking ? 'Active' : 'Idle'}
            description={isTracking ? 'Tracking route' : 'No session'}
            icon={<Activity size={20} color={isTracking ? '#00a97f' : '#64748b'} />}
          />
          <DashboardStatCard
            title="MQTT"
            value={mqttConnected ? 'Online' : 'Offline'}
            description="Broker"
            icon={<Radio size={20} color={mqttConnected ? '#00a97f' : '#ef4444'} />}
          />
        </View>

        <View className="mb-8 flex-row gap-4">
          <DashboardStatCard
            title="GPS"
            value={currentLocation ? 'Signal OK' : 'Waiting'}
            description={currentLocation ? 'Locked' : 'No signal'}
            icon={<MapPinned size={20} color={currentLocation ? '#00a97f' : '#f59e0b'} />}
          />
          <DashboardStatCard
            title="Devices"
            value={`${activeDevicesCount}`}
            description="Active"
            icon={<Smartphone size={20} color="#00a97f" />}
          />
        </View>

        <View className="mb-6">
          <DashboardSectionCard
            title="Live Route"
            subtitle={isTracking ? 'Route tracking is active.' : 'Map of your current location.'}>
            <View className="h-64 overflow-hidden rounded-3xl border border-muted bg-card">
              {currentLocation ? (
                <MapView
                  style={{ width: '100%', height: '100%' }}
                  initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  region={
                    isTracking
                      ? {
                          latitude: currentLocation.latitude,
                          longitude: currentLocation.longitude,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        }
                      : undefined
                  }>
                  <Marker coordinate={currentLocation}>
                    <View className="h-4 w-4 rounded-full border-2 border-white bg-accent shadow-md" />
                  </Marker>

                  {route.length > 0 && (
                    <Polyline
                      coordinates={route}
                      strokeColor="#00a97f"
                      strokeWidth={5}
                      lineJoin="round"
                    />
                  )}
                </MapView>
              ) : (
                <View className="flex-1 items-center justify-center">
                  <MapPinned size={42} color="#00a97f" />
                  <Text className="mt-4 text-lg font-semibold text-textOnDark">
                    Searching for GPS signal...
                  </Text>
                </View>
              )}
            </View>
          </DashboardSectionCard>
        </View>

        <View className="mb-8">
          <DashboardSectionCard
            title="Connected Devices"
            subtitle="Heartbeat and device status are displayed here.">
            <View className="rounded-2xl border border-muted bg-background p-4">
              <Text className="mb-3 font-semibold text-text">
                Currently active devices: {activeDevicesCount}
              </Text>
              <Text className="mt-3 text-xs text-muted/60">User ID: {userId}</Text>
            </View>
          </DashboardSectionCard>
        </View>

        <View className="mb-8">
          <PrimaryButton
            title={isTracking ? 'Stop Activity' : 'Start Activity'}
            onPress={handleToggleActivity}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
