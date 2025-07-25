import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkUrl?: string;
}

const SectionHeader = ({ title, linkText, linkUrl }: SectionHeaderProps) => {
  return (
    <View className="flex-row justify-between items-center mb-4 px-4">
      <Text className="text-xl font-bold text-gray-900">{title}</Text>
      {linkText && linkUrl && (
        <Link href={linkUrl} asChild>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-blue-600 mr-1">{linkText}</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

export default SectionHeader;