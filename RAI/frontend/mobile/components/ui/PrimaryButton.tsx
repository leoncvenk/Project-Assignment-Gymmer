import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger';
};

const variants = {
  primary: 'bg-accent active:bg-accentHover',
  danger: 'bg-danger active:bg-dangerHover',
};

export default function PrimaryButton({ title, onPress, variant = 'primary' }: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} className={`items-center rounded-xl py-4 ${variants[variant]}`}>
      <Text className="text-base font-semibold text-textOnDark">{title}</Text>
    </Pressable>
  );
}
