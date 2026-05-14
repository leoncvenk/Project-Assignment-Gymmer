import { Text, TextInput, View } from 'react-native';

type AuthTextInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export default function AuthTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: AuthTextInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-text">{label}</Text>

      <TextInput
        className="rounded-xl border border-muted bg-white px-4 py-4 text-text"
        placeholder={placeholder}
        placeholderTextColor="#c5c5c5"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
