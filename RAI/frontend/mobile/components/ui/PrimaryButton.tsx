import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-accent active:bg-accentHover items-center rounded-xl py-4">
      <Text className="text-textOnDark text-base font-semibold">{title}</Text>
    </Pressable>
  );
}
