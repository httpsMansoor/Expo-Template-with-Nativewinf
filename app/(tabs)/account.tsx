import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface UserProfile {
  id: number;
  email: string;
  full_name?: string;
  is_staff?: boolean;
  is_active?: boolean;
}

const AccountScreen = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await axios.get('https://web-production-ad8ec.up.railway.app/api/auth/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.warn('Failed to fetch user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setUser(null);
    Alert.alert('You have been logged out.');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Account</Text>

      {user ? (
        <>
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-gray-600">Logged in as:</Text>
            <Text className="text-gray-900 font-semibold">
              {user.full_name || user.email}
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-between bg-white py-4 px-4 rounded-lg mb-2 shadow-sm"
            onPress={() => router.push('/orders')}
          >
            <Text className="text-gray-800 font-medium">My Orders</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Add more options here */}
          {/* <TouchableOpacity
            className="flex-row items-center justify-between bg-white py-4 px-4 rounded-lg mb-2 shadow-sm"
            onPress={() => router.push('/settings')}
          >
            <Text className="text-gray-800 font-medium">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity> */}

          <TouchableOpacity
            className="flex-row items-center justify-between bg-red-50 py-4 px-4 rounded-lg mt-4 shadow-sm"
            onPress={handleLogout}
          >
            <Text className="text-red-600 font-medium">Logout</Text>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text className="text-gray-700 mb-4">You're not logged in yet.</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-3"
            onPress={() => router.push('/auth/login')}
          >
            <Text className="text-center text-white font-semibold">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-200 rounded-lg py-3"
            onPress={() => router.push('/auth/register')}
          >
            <Text className="text-center text-gray-800 font-semibold">Register</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default AccountScreen;
