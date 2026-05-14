import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center rounded-xl bg-accent py-4 active:bg-accentHover">
      <Text className="text-base font-semibold text-textOnDark">{title}</Text>
    </Pressable>
  );
}
