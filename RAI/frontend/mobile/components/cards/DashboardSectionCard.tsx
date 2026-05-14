import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type DashboardSectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function DashboardSectionCard({
  title,
  subtitle,
  children,
}: DashboardSectionCardProps) {
  return (
    <View className="rounded-3xl bg-white p-5 shadow-sm">
      <View className="mb-4">
        <Text className="text-xl font-bold text-text">{title}</Text>

        {subtitle ? <Text className="mt-1 text-sm text-muted">{subtitle}</Text> : null}
      </View>

      {children}
    </View>
  );
}
