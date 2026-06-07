import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Paintbrush } from 'lucide-react-native';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';

export default function ThemeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pb-2 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="-ml-2 mr-4 rounded-full bg-card p-2">
          <ArrowLeft size={24} color="#00a97f" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text">Theme</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <DashboardSectionCard
          title="Appearance"
          subtitle="Customize how Gymmer looks on your device.">
          <View className="items-center justify-center rounded-3xl border border-muted bg-card p-8 py-12">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-accent/20">
              <Paintbrush size={40} color="#00a97f" />
            </View>

            <Text className="mb-2 text-xl font-bold text-textOnDark">Coming Soon</Text>

            <Text className="text-center text-sm text-muted">
              We are currently building Dark Mode and custom themes. This feature will be available
              in a future update!
            </Text>
          </View>
        </DashboardSectionCard>
      </View>
    </SafeAreaView>
  );
}
