import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(name, email, password);
      console.log('✅ Registration successful');

      const message =
        'Registration successful! Please check your email for the verification link.';

      // Show success message
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        Alert.alert('Verify Email', message);
      }

      setSuccess(message);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('❌ Registration error:', err.response?.data || err.message);

      const backendError =
        err?.response?.data?.email?.[0] ||
        err?.response?.data?.full_name?.[0] ||
        err?.response?.data?.password?.[0] ||
        err?.response?.data?.detail ||
        'Registration failed.';

      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6">
      <View className="flex-1 justify-center">
        <View className="bg-white rounded-lg shadow-md p-6">
          <Text className="text-2xl font-bold mb-6">Create Account</Text>

          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title={loading ? 'Registering...' : 'Register'}
            onPress={handleRegister}
            className="mt-4"
            disabled={loading}
          />

          {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
          {success ? <Text className="text-green-600 mt-2">{success}</Text> : null}

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-medium">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
