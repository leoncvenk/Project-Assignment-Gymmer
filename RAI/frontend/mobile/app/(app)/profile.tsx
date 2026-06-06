import { useCallback, useState } from 'react';
import { Bell, Dumbbell, MapPin, Moon, Smartphone, Target, User } from 'lucide-react-native';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import DashboardSectionCard from 'components/cards/DashboardSectionCard';
import PrimaryButton from 'components/ui/PrimaryButton';
import { layout } from 'constants/theme';
import { getAuthToken, getCurrentUser, removeAuthToken } from 'lib/auth';

const accountItems = [
  {
    label: 'Edit Profile',
    description: 'Update body stats and goals',
    icon: User,
    route: '/edit-profile',
  },
  {
    label: 'Nutrition Targets',
    description: 'Review calories and macros',
    icon: Target,
    route: '/nutrition-targets',
  },
  {
    label: 'Connected Devices',
    description: 'Manage activity devices',
    icon: Smartphone,
    route: '/connected-devices',
  },
];

const preferenceItems = [
  {
    label: 'Notifications',
    description: 'Activity and nutrition reminders',
    icon: Bell,
    route: '/notifications',
  },
  {
    label: 'Location Permissions',
    description: 'GPS access for live activity tracking',
    icon: MapPin,
    route: '/permissions',
  },
  { label: 'Theme', description: 'Light mode active', icon: Moon, route: '/theme' },
];

interface UserProfile {
  username: string;
  email: string;
  profile_completed: boolean;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchUser() {
        try {
          const token = await getAuthToken();
          if (!token) return;

          const user = await getCurrentUser(token);
          setUserData(user);
        } catch (error) {
          console.error('Napaka pri nalaganju profila:', error);
        }
      }

      fetchUser();
    }, [])
  );

  async function handleLogout() {
    try {
      await removeAuthToken();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Napaka pri odjavi:', error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-6"
        contentContainerClassName="py-8"
        contentContainerStyle={{
          paddingTop: 32,
          paddingBottom: layout.floatingTabBarSafePadding,
        }}
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
              <Text className="text-2xl font-bold text-textOnDark">
                {userData?.username ?? 'Nalaganje...'}
              </Text>
              <Text className="mt-1 text-sm text-muted">{userData?.email ?? 'Nalaganje...'}</Text>
            </View>
          </View>

          <View className="mt-5 rounded-2xl bg-sidebar p-4">
            <Text className="text-sm font-semibold text-textOnDark">Profile status</Text>
            <Text className="mt-1 text-sm text-muted">
              {userData?.profile_completed
                ? 'Profile completed. Nutrition targets are ready.'
                : 'Profile setup incomplete. Please update your stats.'}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <DashboardSectionCard title="Account" subtitle="Profile and goal management.">
            <View className="gap-3">
              {accountItems.map((item) => {
                const Icon = item.icon;

                return (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.7}
                    onPress={() => router.push(item.route as any)}
                    className="flex-row items-center gap-4 rounded-2xl border border-muted bg-background p-4">
                    <View className="rounded-2xl bg-accent/10 p-3">
                      <Icon size={22} color="#00a97f" />
                    </View>

                    <View className="flex-1">
                      <Text className="font-semibold text-text">{item.label}</Text>
                      <Text className="mt-1 text-sm text-muted">{item.description}</Text>
                    </View>
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.7}
                    onPress={() => router.push(item.route as any)}
                    className="flex-row items-center gap-4 rounded-2xl border border-muted bg-background p-4">
                    <View className="rounded-2xl bg-accent/10 p-3">
                      <Icon size={22} color="#00a97f" />
                    </View>

                    <View className="flex-1">
                      <Text className="font-semibold text-text">{item.label}</Text>
                      <Text className="mt-1 text-sm text-muted">{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </DashboardSectionCard>
        </View>

        <PrimaryButton title="Log out" onPress={handleLogout} variant="danger" />
      </ScrollView>
    </SafeAreaView>
  );
}
