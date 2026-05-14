import {
  Bell,
  Dumbbell,
  LogOut,
  MapPin,
  Moon,
  Smartphone,
  Target,
  User,
} from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import PrimaryButton from 'components/ui/PrimaryButton';

const accountItems = [
  { label: 'Edit Profile', description: 'Update body stats and goals', icon: User },
  { label: 'Nutrition Targets', description: 'Review calories and macros', icon: Target },
  { label: 'Connected Devices', description: 'Manage activity devices', icon: Smartphone },
];

const preferenceItems = [
  { label: 'Notifications', description: 'Activity and nutrition reminders', icon: Bell },
  {
    label: 'Location Permissions',
    description: 'GPS access for live activity tracking',
    icon: MapPin,
  },
  { label: 'Theme', description: 'Light mode active', icon: Moon },
];

export default function ProfileScreen() {
  function handleLogout() {}

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-8"
        showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-4xl font-bold text-text">Profile</Text>
          <Text className="mt-3 text-base text-muted">
            Manage your Gymmer account, goals, and app preferences.
          </Text>
        </View>

        <View className="mb-6 rounded-3xl bg-card p-6 shadow-sm">
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-3xl bg-accent">
              <Dumbbell size={30} color="#f2f2f2" />
            </View>

            <View className="flex-1">
              <Text className="text-2xl font-bold text-textOnDark">Gymmer User</Text>
              <Text className="mt-1 text-sm text-muted">user@example.com</Text>
            </View>
          </View>

          <View className="mt-5 rounded-2xl bg-sidebar p-4">
            <Text className="text-sm font-semibold text-textOnDark">Profile status</Text>
            <Text className="mt-1 text-sm text-muted">
              Profile completed. Nutrition targets are ready.
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <DashboardSectionCard title="Account" subtitle="Profile and goal management.">
            <View className="gap-3">
              {accountItems.map((item) => {
                const Icon = item.icon;

                return (
                  <View
                    key={item.label}
                    className="flex-row items-center gap-4 rounded-2xl border border-muted bg-background p-4">
                    <View className="rounded-2xl bg-accent/10 p-3">
                      <Icon size={22} color="#00a97f" />
                    </View>

                    <View className="flex-1">
                      <Text className="font-semibold text-text">{item.label}</Text>
                      <Text className="mt-1 text-sm text-muted">{item.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </DashboardSectionCard>
        </View>

        <View className="mb-8">
          <DashboardSectionCard title="Preferences" subtitle="App behavior and permissions.">
            <View className="gap-3">
              {preferenceItems.map((item) => {
                const Icon = item.icon;

                return (
                  <View
                    key={item.label}
                    className="flex-row items-center gap-4 rounded-2xl border border-muted bg-background p-4">
                    <View className="rounded-2xl bg-accent/10 p-3">
                      <Icon size={22} color="#00a97f" />
                    </View>

                    <View className="flex-1">
                      <Text className="font-semibold text-text">{item.label}</Text>
                      <Text className="mt-1 text-sm text-muted">{item.description}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </DashboardSectionCard>
        </View>

        <PrimaryButton title="Log out" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}
