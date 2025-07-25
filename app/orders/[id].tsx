import api from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) fetchOrder(String(id));
  }, [id]);

  const fetchOrder = async (orderId: string) => {
    try {
      const res = await api.get('/orders/my/');
      const match = res.data.find((o: any) => o.id.toString() === orderId);
      if (!match) throw new Error('Order not found');
      setOrder(match);
    } catch (err) {
      Alert.alert('Error', 'Failed to load order details.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4 bg-gray-50">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Order #{order.order_number}</Text>

      <Text className="text-gray-800 mb-1 font-semibold">Status: {order.status}</Text>
      <Text className="text-gray-600 mb-1">
        Payment: {order.payment_method?.method_type || 'N/A'} ({order.payment_status})
      </Text>
      {order.payment_method?.account_last4 && (
        <Text className="text-gray-600 mb-1">
          Card ending in •••• {order.payment_method.account_last4}
        </Text>
      )}
      <Text className="text-gray-600 mb-1">Total: ${order.total_amount}</Text>
      <Text className="text-gray-600 mb-4">Created: {new Date(order.created_at).toLocaleString()}</Text>

      <Text className="text-lg font-bold mb-2 text-gray-900">Shipping Info</Text>
      <View className="mb-4">
        <Text className="text-gray-700">{order.delivery_address.full_name}</Text>
        <Text className="text-gray-700">{order.delivery_address.street_address}</Text>
        <Text className="text-gray-700">
          {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
        </Text>
        <Text className="text-gray-700">{order.delivery_address.country}</Text>
        <Text className="text-gray-700">Phone: {order.delivery_address.phone}</Text>
        <Text className="text-gray-700">Email: {order.delivery_address.email}</Text>
      </View>

      <Text className="text-lg font-bold mb-2 text-gray-900">Items</Text>
      {order.items?.length > 0 ? (
        order.items.map((item: any) => (
          <View key={item.id} className="border-b border-gray-200 py-2">
            <Text className="text-gray-800 font-medium">{item.product_name}</Text>
            <Text className="text-gray-600">
              Qty: {item.quantity} × ${item.unit_price} = ${item.total_price}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-gray-500">No items found.</Text>
      )}
    </ScrollView>
  );
};

export default OrderDetailScreen;
