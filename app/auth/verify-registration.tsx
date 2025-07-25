import api from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';

export default function VerifyRegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Handles both query string and path param styles
  const userId = params.user_id as string;
  const timestampRaw = params.timestamp as string;
  const signature = params.signature as string;

  const timestamp = timestampRaw ? parseInt(timestampRaw) : NaN;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyUser = async () => {
      if (!userId || isNaN(timestamp) || !signature) {
        setMessage('Invalid verification link.');
        setStatus('error');
        return;
      }

      try {
        const res = await api.post('/auth/verify-registration/', {
          user_id: userId,
          timestamp,
          signature,
        });

        console.log('✅ Verified:', res.data);
        setMessage('Your email has been verified successfully. Redirecting to login...');
        setStatus('success');

        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
      } catch (err: any) {
        console.error('❌ Verification failed:', err.response?.data || err.message);
        setMessage('Verification failed. Please try again or request a new link.');
        setStatus('error');
      }
    };

    verifyUser();
  }, [userId, timestamp, signature]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6 justify-center items-center">
      <View className="bg-white p-6 rounded-md shadow-md w-full">
        <Text className="text-2xl font-bold text-center mb-4">Verify Email</Text>

        {status === 'loading' && (
          <View className="items-center">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-gray-600">Verifying your account...</Text>
          </View>
        )}

        {status === 'success' && (
          <Text className="text-green-600 text-center">{message}</Text>
        )}

        {status === 'error' && (
          <Text className="text-red-500 text-center">{message}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
