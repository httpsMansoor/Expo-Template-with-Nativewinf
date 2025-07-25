// File: app/orders/addresses/new.tsx
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

const AddAddressScreen = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post('/orders/addresses/', form);
      Alert.alert('Success', 'Address added');
      router.back();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      Alert.alert('Failed', 'Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Add New Address</Text>
      {[
        ['Full Name', 'full_name'],
        ['Street Address', 'street_address'],
        ['City', 'city'],
        ['State', 'state'],
        ['Postal Code', 'postal_code'],
        ['Country', 'country'],
        ['Phone', 'phone'],
        ['Email', 'email'],
      ].map(([label, key]) => (
        <View key={key} className="mb-4">
          <Text className="text-gray-700 mb-1">{label}</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={form[key as keyof typeof form]}
            onChangeText={val => handleChange(key as keyof typeof form, val)}
          />
        </View>
      ))}
      <Button
        title={loading ? 'Saving...' : 'Save Address'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default AddAddressScreen;
