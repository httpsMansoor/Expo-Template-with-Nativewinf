// File: app/orders/payments/new.tsx
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

const AddPaymentMethodScreen = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    method_type: 'VISA',
    provider: '',
    account_last4: '',
    expiry: '',
    is_default: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, val: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/orders/payments/', form);
      Alert.alert('Success', 'Payment method added');
      router.back();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert('Failed', 'Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Add Payment Method</Text>

      {/* Method Type */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Method Type</Text>
        {['VISA', 'MC', 'PP', 'COD'].map(type => (
          <Text
            key={type}
            className={`py-2 px-4 mb-1 rounded-lg border ${
              form.method_type === type
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            }`}
            onPress={() => handleChange('method_type', type)}
          >
            {type}
          </Text>
        ))}
      </View>

      {/* Optional Fields */}
      {['provider', 'account_last4', 'expiry'].map(field => (
        <View key={field} className="mb-4">
          <Text className="text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={form[field as keyof typeof form] as string}
            onChangeText={val => handleChange(field as keyof typeof form, val)}
          />
        </View>
      ))}

      <Button
        title={loading ? 'Saving...' : 'Save Payment Method'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default AddPaymentMethodScreen;
