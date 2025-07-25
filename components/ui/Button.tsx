import { colors } from '@/constants/colors';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  icon,
}: ButtonProps) => {
  let backgroundColor = colors.primary;
  let borderColor = 'transparent';
  let textColor = 'white';
  if (variant === 'secondary') backgroundColor = colors.secondary;
  if (variant === 'outline') {
    backgroundColor = 'transparent';
    borderColor = colors.primary;
    textColor = colors.primary;
  }
  if (variant === 'text') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
  }

  let paddingVertical = 12, paddingHorizontal = 24;
  if (size === 'small') {
    paddingVertical = 8;
    paddingHorizontal = 16;
  } else if (size === 'large') {
    paddingVertical = 16;
    paddingHorizontal = 32;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor,
        borderColor,
        borderWidth: variant === 'outline' ? 2 : 0,
        opacity: disabled ? 0.5 : 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical,
        paddingHorizontal,
      }}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text style={{ color: textColor, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;