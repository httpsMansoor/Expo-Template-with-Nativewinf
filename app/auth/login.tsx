import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/(tabs)/home'); // Redirect to home
    } catch (err) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-grey-100 px-6">
    <View className="flex-1 justify-center">
      <View className="bg-white rounded-lg shadow-md p-6">
  
      <Text className="text-2xl font-bold mb-6 flex-row justify-center mt-4 " >Login to TechHive</Text>
      
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button 
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        className="mt-4"
        disabled={loading}
      />
      {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
      
      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="/auth/register" asChild>
          <TouchableOpacity>
            <Text className="text-blue-600 font-medium">Register</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <Link href="/auth/forget-pasword" asChild>
        <TouchableOpacity className="mt-4">
          <Text className="text-blue-600 text-center">Forgot password?</Text>
        </TouchableOpacity>
      </Link>
    </View>
    
      </View>
    </SafeAreaView>
  );
}