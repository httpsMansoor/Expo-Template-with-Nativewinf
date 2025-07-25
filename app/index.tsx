// File: app/index.tsx
import { Redirect } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { useAuth } from './context/AuthContext';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={require('../assets/images/splash-icon.png')} // ✅ must match app.json logo path
          style={{ width: 100, height: 100, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mb-2">TechHive</Text>
        <Text className="text-gray-500">Loading your experience...</Text>
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/home' : '/auth/login'} />;
}
