import { Apple, Route, UserRound } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { layout } from 'constants/theme';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00a97f',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,

          height: layout.floatingTabBarHeight,

          backgroundColor: 'rgba(255,255,255,0.8)',
          borderTopWidth: 0,
          borderRadius: 30,

          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },

          elevation: 0,

          marginHorizontal: 16,
          marginBottom: layout.floatingTabBarMarginBottom,

          paddingTop: 10,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color }) => <Apple size={26} color={color} strokeWidth={2.2} />,
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Route size={26} color={color} strokeWidth={2.2} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UserRound size={26} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tabs>
  );
}
