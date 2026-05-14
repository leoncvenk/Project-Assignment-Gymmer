import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type DashboardStatCardProps = {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
};

export default function DashboardStatCard({
  title,
  value,
  description,
  icon,
}: DashboardStatCardProps) {
  return (
    <View className="flex-1 rounded-3xl bg-white p-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted">{title}</Text>

        {icon ? <View className="rounded-2xl bg-accent/10 p-2">{icon}</View> : null}
      </View>

      <Text className="text-3xl font-bold text-text">{value}</Text>

      {description ? <Text className="mt-2 text-sm text-muted">{description}</Text> : null}
    </View>
  );
}
