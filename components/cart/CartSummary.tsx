import React from 'react';
import { View, Text } from 'react-native';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout?: () => void;
}

const CartSummary = ({ subtotal, shipping, tax, total, onCheckout }: CartSummaryProps) => {
  const summaryItems = [
    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
    { label: 'Shipping', value: `$${shipping.toFixed(2)}` },
    { label: 'Tax', value: `$${tax.toFixed(2)}` },
    { label: 'Total', value: `$${total.toFixed(2)}`, isTotal: true },
  ];

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-900 mb-4">Order Summary</Text>
      
      {summaryItems.map((item, index) => (
        <View 
          key={item.label} 
          className={`flex-row justify-between py-2 ${index < summaryItems.length - 1 ? 'border-b border-gray-100' : ''}`}
        >
          <Text className={`text-gray-600 ${item.isTotal ? 'font-bold' : ''}`}>
            {item.label}
          </Text>
          <Text className={`text-gray-900 ${item.isTotal ? 'font-bold text-lg' : ''}`}>
            {item.value}
          </Text>
        </View>
      ))}
      
      <Button 
        title="Proceed to Checkout"
        className="mt-6"
        onPress={onCheckout}
      />
    </View>
  );
};

export default CartSummary;