import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { sendResetPasswordLink } from '@/lib/api'; // Import the API function

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');
    
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      await sendResetPasswordLink(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 px-6">
        <View className="flex-1 justify-center">
          <View className="bg-white rounded-lg shadow-md p-6">
            <View className="items-center mb-4">
              <View className="h-12 w-12 rounded-full bg-green-100 items-center justify-center">
                <Ionicons name="checkmark-circle" size={32} color="#16a34a" />
              </View>
            </View>
            <Text className="text-2xl font-bold text-center text-gray-900">
              Check your email
            </Text>
            <Text className="text-center text-gray-500 mt-1">
              We've sent a password reset link to {email}
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-4">
              Didn't receive the email? Check your spam folder or try again.
            </Text>
            <Button
              title="Try again"
              onPress={() => setSent(false)}
              className="mt-4 bg-white border border-gray-300"
              disabled={loading}
            />
            <View className="mt-4 flex-row justify-center">
              <Link href="/auth/login" asChild>
                <TouchableOpacity className="flex-row items-center">
                  <Ionicons name="arrow-back" size={16} color="#3b82f6" />
                  <Text className="text-blue-600 text-sm font-medium ml-1">
                    Back to sign in
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-6">
      <View className="flex-1 justify-center">
        <View className="bg-white rounded-lg shadow-md p-6">
          <Text className="text-2xl font-bold text-center text-gray-900">
            Reset password
          </Text>
          <Text className="text-center text-gray-500 mt-1">
            Enter your email and we'll send you a reset link
          </Text>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="mt-4"
          />
          {error ? (
            <Text className="text-red-500 mt-2">
              {error}
            </Text>
          ) : null}
          <Button
            title={loading ? 'Sending reset link...' : 'Send reset link'}
            onPress={handleResetPassword}
            className="mt-4"
            disabled={loading}
          />
          <View className="mt-4 flex-row justify-center">
            <Link href="/auth/login" asChild>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="arrow-back" size={16} color="#3b82f6" />
                <Text className="text-blue-600 text-sm font-medium ml-1">
                  Back to sign in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;