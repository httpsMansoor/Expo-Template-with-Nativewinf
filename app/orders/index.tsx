import api from '@/lib/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const OrdersScreen = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenOrders, setHiddenOrders] = useState<number[]>([]);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my/');
      setOrders(res.data);
    } catch (err) {
      Alert.alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const visibleOrders = orders.filter((order) => !hiddenOrders.includes(order.id));

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!visibleOrders.length) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-lg">You haven't placed any orders.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">My Orders</Text>
      {visibleOrders.map((order) => (
        <TouchableOpacity
          key={order.id}
          className="bg-white rounded-lg p-4 mb-4 shadow-sm"
          onPress={() => router.push(`/orders/${order.id}`)}
        >
          <Text className="text-gray-800 font-semibold mb-1">
            Order #{order.order_number}
          </Text>
          <Text className="text-gray-600 mb-1">Status: {order.status}</Text>
          <Text className="text-gray-600 mb-1">
            Payment: {order.payment_method?.method_type || 'N/A'} ({order.payment_status})
          </Text>
          {order.payment_method?.account_last4 && (
            <Text className="text-gray-600 mb-1">
              Card ending in •••• {order.payment_method.account_last4}
            </Text>
          )}
          <Text className="text-gray-600 mb-2">Total: ${order.total_amount}</Text>

          <View className="flex-row flex-wrap gap-2 mt-2">
            {/* Cancel Button */}
            {order.status !== 'CANCELLED' && (
              <TouchableOpacity
                onPress={() => handleCancel(order.id)}
                className="bg-red-100 px-3 py-2 rounded-lg"
              >
                <Text className="text-red-600 font-medium">Cancel</Text>
              </TouchableOpacity>
            )}

            {/* Confirm Button (only if not confirmed or cancelled) */}
            {order.status !== 'CONFIRMED' && order.status !== 'CANCELLED' && (
              <TouchableOpacity
                onPress={() => handleConfirm(order.id)}
                className="bg-green-100 px-3 py-2 rounded-lg"
              >
                <Text className="text-green-600 font-medium">Confirm</Text>
              </TouchableOpacity>
            )}

            {/* Delete Button for Cancelled Orders */}
            {order.status === 'CANCELLED' && (
              <TouchableOpacity
                onPress={() => handleHide(order.id)}
                className="bg-gray-200 px-3 py-2 rounded-lg"
              >
                <Text className="text-gray-800 font-medium">Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  function handleCancel(orderId: number) {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.post(`/orders/cancel/${orderId}/`);
              
              fetchOrders();
            } catch {
              Alert.alert('Failed to cancel order');
            }
          },
        },
      ]
    );
  }

  function handleConfirm(orderId: number) {
    Alert.alert(
      'Confirm Order',
      'Do you want to confirm this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await api.post(`/orders/confirm/${orderId}/`);
              
              fetchOrders();
            } catch {
              Alert.alert('Failed to confirm order');
            }
          },
        },
      ]
    );
  }

  function handleHide(orderId: number) {
    Alert.alert(
      'Delete Order',
      'Do you really want to delete this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setHiddenOrders((prev) => [...prev, orderId]);
        
          },
        },
      ]
    );
  }
};

export default OrdersScreen;
