import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { colors } from 'constants/theme';
import { getTargetStatusColors } from 'utils/nutrition';

type DashboardStatCardProps = {
  title: string;
  value: string;
  description?: string;
  percent?: number;
  icon?: ReactNode;
};

export default function DashboardStatCard({
  title,
  value,
  description,
  percent,
  icon,
}: DashboardStatCardProps) {
  const statusColors = percent !== undefined ? getTargetStatusColors(percent) : undefined;

  return (
    <View
      className="flex-1 rounded-3xl p-5 shadow-sm"
      style={{
        backgroundColor: statusColors?.backgroundColor ?? colors.white,
        borderColor: statusColors?.borderColor ?? 'transparent',
      }}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted">{title}</Text>

        {icon ? <View className="rounded-2xl bg-accent/10 p-2">{icon}</View> : null}
      </View>

      <Text
        className="text-3xl font-bold"
        style={{
          color: statusColors?.textColor ?? colors.muted,
        }}>
        {value}
      </Text>

      {description ? <Text className="mt-2 text-sm text-muted">{description}</Text> : null}
    </View>
  );
}
