import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const Badge = ({ text, variant = 'primary' }: BadgeProps) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return `bg-${colors.secondary} text-white`;
      case 'success':
        return `bg-${colors.success} text-white`;
      case 'danger':
        return `bg-${colors.danger} text-white`;
      case 'warning':
        return `bg-${colors.warning} text-white`;
      default:
        return `bg-${colors.primary} text-white`;
    }
  };

  return (
    <View className={`${getVariantStyle()} px-2 py-1 rounded-full self-start`}>
      <Text className="text-xs font-bold">{text}</Text>
    </View>
  );
};

export default Badge;