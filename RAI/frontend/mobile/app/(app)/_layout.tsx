import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { Apple, Route, UserRound } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { layout } from 'constants/theme';
import * as Notifications from 'expo-notifications';
import { getAuthToken, getCurrentUser } from 'lib/auth';
import { connectMqtt, sendHeartbeat, disconnectMqtt } from 'lib/mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext<any>(null);
export const useGlobalData = () => useContext(GlobalContext);

if (Platform.OS === 'ios') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export default function AppLayout() {
  const [data, setData] = useState({
    mqttConnected: false,
    activeDevicesCount: 0,
    userId: 'Loading...',
    deviceId: '',
    notifications: { nutrition: true, activity: false },
  });

  const deviceId = useRef(`device_${Math.random().toString(16).slice(2, 8)}`).current;
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const initMqtt = async (userId: string) => {
    disconnectMqtt();
    connectMqtt(
      userId,
      deviceId,
      () => {
        setData((prev) => ({ ...prev, mqttConnected: true }));
        sendHeartbeat(userId, deviceId);
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = setInterval(() => sendHeartbeat(userId, deviceId), 15000);
      },
      () => {
        setData((prev) => ({ ...prev, mqttConnected: false }));
      }
    );
  };

  useEffect(() => {
    let countInterval: NodeJS.Timeout;

    const startAppLogic = async () => {
      const saved = await AsyncStorage.getItem('notif_settings');
      if (saved) setData((prev) => ({ ...prev, notifications: JSON.parse(saved).isEnabled }));

      const token = await getAuthToken();
      if (!token) return;

      const user = await getCurrentUser(token);
      const currentUserId = (user as any).id || 'unknown_user';
      setData((prev) => ({ ...prev, userId: currentUserId }));

      await initMqtt(currentUserId);

      const fetchCount = async () => {
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/users/me/devices/active-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.ok) {
            const json = await res.json();
            setData((prev) => ({ ...prev, activeDevicesCount: json.count ?? 0 }));
          }
        } catch (e) {
          console.warn('API Error');
        }
      };

      fetchCount();
      countInterval = setInterval(fetchCount, 15000);
    };

    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App is active - refreshing MQTT...');
          const token = await getAuthToken();
          const user = await getCurrentUser(token as string);
          initMqtt((user as any).id);
        }
        appState.current = nextAppState;
      }
    );

    startAppLogic();

    return () => {
      subscription.remove();
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
      if (countInterval) clearInterval(countInterval);
      disconnectMqtt();
    };
  }, []);

  return (
    <GlobalContext.Provider value={data}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#00a97f',
          tabBarStyle: {
            height: layout.floatingTabBarHeight,
            backgroundColor: 'rgba(255,255,255,0.8)',
            marginHorizontal: 16,
            marginBottom: layout.floatingTabBarMarginBottom,
            borderRadius: 30,
          },
        }}>
        <Tabs.Screen
          name="nutrition"
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ color }) => <Apple size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color }) => <Route size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <UserRound size={26} color={color} />,
          }}
        />
      </Tabs>
    </GlobalContext.Provider>
  );
}
