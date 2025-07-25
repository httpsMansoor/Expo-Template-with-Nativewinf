import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { resetPassword } from '@/lib/api';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // Extract parameters from the URL using useLocalSearchParams
  const params = useLocalSearchParams();
  const userId = params.user_id as string;
  const timestamp = params.timestamp as string;
  const signature = params.signature as string;

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');
    
    // Validate inputs
    if (!password || !confirmPassword) {
      setError('Please enter both password fields');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(
        userId,
        parseInt(timestamp),
        signature,
        password
      );

      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.replace('/auth/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6">
    <View className="flex-1 justify-center">
      <View className="bg-white rounded-lg shadow-md p-6">
      <Text className="text-2xl font-bold mb-6">Reset Password</Text>
      
      {!userId || !timestamp || !signature ? (
        <Text className="text-red-500 mb-4">
          Invalid reset link. Please request a new password reset.
        </Text>
      ) : (
        <>
          <Input
            label="New Password"
            placeholder="Enter your new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Input
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <Button
            title={loading ? 'Resetting...' : 'Reset Password'}
            onPress={handleResetPassword}
            className="mt-4"
            disabled={loading}
          />
          
          {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
          {success ? <Text className="text-green-500 mt-2">{success}</Text> : null}
        </>
      )}
      
      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-600">Remember your password? </Text>
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