// File: app/orders/payments/select.tsx
import api from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const SelectPaymentScreen = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPaymentMethods = async () => {
    try {
      const res = await api.get('/orders/payments/');
      setMethods(res.data);
    } catch (err) {
      console.warn('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleSelect = (payment: any) => {
    router.push({
      pathname: '/cart/checkout',
      params: {
        selectedPaymentId: payment.id,
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-2xl font-bold mb-4 text-gray-900">Select Payment Method</Text>
      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => handleSelect(method)}
          className="bg-gray-100 rounded-lg p-4 mb-3 border border-gray-300"
        >
          <Text className="text-gray-800 font-medium">{method.method_type}</Text>
          {method.account_last4 && (
            <Text className="text-gray-600">Ending in •••• {method.account_last4}</Text>
          )}
          {method.expiry && (
            <Text className="text-gray-600">Expires {method.expiry}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SelectPaymentScreen;
