import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Clock } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrimaryButton from 'components/ui/PrimaryButton';

export default function NotificationsScreen() {
  const [isEnabled, setIsEnabled] = useState({ nutrition: true, activity: false });
  const [nutritionTime, setNutritionTime] = useState(new Date());
  const [activityTime, setActivityTime] = useState(new Date());
  const [show, setShow] = useState<{ type: 'nutrition' | 'activity' | null }>({ type: null });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const saved = await AsyncStorage.getItem('notif_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if data exists before loading it to prevent app crashes
        if (parsed.isEnabled) setIsEnabled(parsed.isEnabled);
        if (parsed.nutritionTime) setNutritionTime(new Date(parsed.nutritionTime));
        if (parsed.activityTime) setActivityTime(new Date(parsed.activityTime));
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }

  const handleSave = async () => {
    console.log('Saving state:', { isEnabled, nutritionTime, activityTime });

    await AsyncStorage.setItem(
      'notif_settings',
      JSON.stringify({ isEnabled, nutritionTime, activityTime })
    );

    await Notifications.cancelAllScheduledNotificationsAsync();

    if (isEnabled.nutrition) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Gymmer: Time to Eat!',
          body: "Don't forget to log your meal.",
        },
        trigger: {
          type: 'calendar',
          hour: nutritionTime.getHours(),
          minute: nutritionTime.getMinutes(),
          repeats: true,
          channelId: 'default',
        },
      });

      console.log(
        'Nutrition scheduled at:',
        nutritionTime.getHours(),
        ':',
        nutritionTime.getMinutes()
      );
    }

    if (isEnabled.activity) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Gymmer: Time to Move!',
          body: 'Time for some physical activity.',
        },
        trigger: {
          type: 'calendar',
          hour: activityTime.getHours(),
          minute: activityTime.getMinutes(),
          repeats: true,
          channelId: 'default',
        },
      });

      console.log(
        'Activity scheduled at:',
        activityTime.getHours(),
        ':',
        activityTime.getMinutes()
      );
    }

    Alert.alert('Saved', 'Your settings have been updated!');
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-6 py-4">
        <ArrowLeft size={24} color="#f2f2f2" onPress={() => router.back()} />
        <Text className="ml-4 text-xl font-bold text-text">Notifications</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <View className="gap-6 rounded-3xl bg-card p-6">
          {/* NUTRITION */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-bold text-textOnDark">Nutrition Reminders</Text>
              <Switch
                value={isEnabled.nutrition}
                onValueChange={(val) => setIsEnabled((prev) => ({ ...prev, nutrition: val }))}
                trackColor={{ true: '#00a97f' }}
              />
            </View>

            {isEnabled.nutrition && (
              <TouchableOpacity
                onPress={() => setShow({ type: 'nutrition' })}
                className="flex-row items-center rounded-xl bg-sidebar p-4">
                <Clock size={20} color="#9ca3af" />
                <Text className="ml-3 text-textOnDark">
                  {nutritionTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ACTIVITY */}
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-bold text-textOnDark">Activity Reminders</Text>
              <Switch
                value={isEnabled.activity}
                onValueChange={(val) => setIsEnabled((prev) => ({ ...prev, activity: val }))}
                trackColor={{ true: '#00a97f' }}
              />
            </View>

            {isEnabled.activity && (
              <TouchableOpacity
                onPress={() => setShow({ type: 'activity' })}
                className="flex-row items-center rounded-xl bg-sidebar p-4">
                <Clock size={20} color="#9ca3af" />
                <Text className="ml-3 text-textOnDark">
                  {activityTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {show.type && (
          <DateTimePicker
            value={show.type === 'nutrition' ? nutritionTime : activityTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => {
              setShow({ type: null }); // Close picker

              if (date) {
                if (show.type === 'nutrition') setNutritionTime(date);
                else setActivityTime(date);
              }
            }}
          />
        )}

        <View className="mt-8">
          <PrimaryButton title="Save Preferences" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
