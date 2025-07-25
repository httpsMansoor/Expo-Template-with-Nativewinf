import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  icon,
  className = '',
}: InputProps) => {
  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-gray-700 mb-1 font-medium">{label}</Text>}
      <View className="flex-row items-center border border-gray-300 rounded-lg px-3">
        {icon && <View className="mr-2">{icon}</View>}
        <TextInput
          className="flex-1 py-3 text-gray-700"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && <Text className="text-red-500 mt-1 text-xs">{error}</Text>}
    </View>
  );
};

export default Input;