import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../app/context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <View className="bg-white py-4 px-4 flex-row items-center justify-between border-b border-gray-200">
      <Link href="/" asChild>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="cube" size={28} color={colors.primary} />
          <Text className="text-xl font-bold ml-2 text-gray-900">TechHive</Text>
        </TouchableOpacity>
      </Link>
      
      <View className="flex-row items-center space-x-4">
        <Link href="/search" asChild>
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={colors.dark} />
          </TouchableOpacity>
        </Link>
        <Link href="/cart" asChild>
          <TouchableOpacity>
            <View className="relative">
              <Ionicons name="cart-outline" size={24} color={colors.dark} />
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-xs">2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
        {isAuthenticated && (
          <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 12 }}>
            <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;