// File: app/cart/checkout.tsx
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useCart } from '../context/CartContext';

const CheckoutScreen = () => {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  const params = useLocalSearchParams();
  const selectedAddressId = params.selectedAddressId?.toString();
  const selectedPaymentId = params.selectedPaymentId?.toString();

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const fetchCheckoutData = async () => {
    try {
      const [addrRes, payRes] = await Promise.all([
        api.get('/orders/addresses/'),
        api.get('/orders/payments/')
      ]);
      setAddresses(addrRes.data);
      setPayments(payRes.data);

      if (addrRes.data.length) {
        const found = addrRes.data.find((a: any) => a.id.toString() === selectedAddressId);
        setSelectedAddress(found || addrRes.data[0]);
      }

      if (payRes.data.length) {
        const found = payRes.data.find((p: any) => p.id.toString() === selectedPaymentId);
        setSelectedPayment(found || payRes.data[0]);
      }
    } catch (err) {
      console.warn('Error fetching checkout data', err);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, [selectedAddressId, selectedPaymentId]);

  const handleSubmit = async () => {
    if (!selectedAddress || !selectedPayment) {
      Alert.alert('Missing Info', 'Please add address and payment method.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before checking out.');
      return;
    }

    try {
      setLoading(true);

      // ✅ Sync local cart with backend cart
      await api.post('/cart/add_items/', {
        items: cartItems.map(item => ({
          product: parseInt(item.id), // Must be integer
          quantity: item.quantity,
        })),
      });

      // ✅ Place order
      await api.post('/orders/checkout/', {
        delivery_address_id: selectedAddress.id,
        payment_method_id: selectedPayment.id,
      });

      // ✅ Optionally clear local cart
      clearCart();

      Alert.alert('Success', 'Order placed successfully');
      router.push('/orders');
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      Alert.alert('Checkout failed', 'Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6 text-gray-900">Checkout</Text>

      {/* Shipping Address */}
      <Text className="text-lg font-semibold mb-2">Shipping Address</Text>
      {selectedAddress ? (
        <View className="bg-gray-100 rounded-lg p-4 mb-2">
          <Text className="text-gray-800 font-medium">{selectedAddress.full_name}</Text>
          <Text className="text-gray-600">{selectedAddress.street_address}</Text>
          <Text className="text-gray-600">
            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
          </Text>
          <Text className="text-gray-600">{selectedAddress.country}</Text>
          <Text className="text-gray-600">Phone: {selectedAddress.phone}</Text>
        </View>
      ) : null}
      <View className="flex-row gap-4 mb-6">
        <Button
          title={selectedAddress ? 'Select Different Address' : 'Add New Address'}
          onPress={() =>
            router.push(
              selectedAddress
                ? '/orders/addresses/select'
                : '/orders/addresses/new'
            )
          }
          className="flex-1"
          variant={selectedAddress ? 'outline' : 'primary'}
        />
      </View>

      {/* Payment Method */}
      <Text className="text-lg font-semibold mb-2">Payment Method</Text>
      {selectedPayment ? (
        <View className="bg-gray-100 rounded-lg p-4 mb-2">
          <Text className="text-gray-800 font-medium">{selectedPayment.method_type}</Text>
          {selectedPayment.account_last4 && (
            <Text className="text-gray-600">Ending in •••• {selectedPayment.account_last4}</Text>
          )}
          {selectedPayment.expiry && (
            <Text className="text-gray-600">Expires {selectedPayment.expiry}</Text>
          )}
        </View>
      ) : null}
      <View className="flex-row gap-4 mb-6">
        <Button
          title={selectedPayment ? 'Use Different Payment Method' : 'Add Payment Method'}
          onPress={() =>
            router.push(
              selectedPayment
                ? '/orders/payments/select'
                : '/orders/payments/new'
            )
          }
          className="flex-1"
          variant={selectedPayment ? 'outline' : 'primary'}
        />
      </View>

      {/* Submit */}
      <Button
        title={loading ? 'Placing Order...' : `Place Order ($${cartTotal.toFixed(2)})`}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default CheckoutScreen;
