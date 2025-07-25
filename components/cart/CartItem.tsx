import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: any;
    quantity: number;
  };
  onRemove?: () => void;
  onQuantityChange?: (quantity: number) => void;
}

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl p-4 mb-4 shadow-sm">
      <Image 
        source={item.image} 
        className="w-20 h-20 rounded-lg mr-4"
        resizeMode="contain"
      />
      
      <View className="flex-1">
        <Text className="font-bold text-gray-900 mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-lg font-bold text-gray-900 mb-2">${item.price.toFixed(2)}</Text>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center border border-gray-300 rounded-lg">
            <TouchableOpacity 
              className="px-3 py-2"
              onPress={() => onQuantityChange?.(Math.max(1, item.quantity - 1))}
            >
              <Ionicons name="remove" size={16} color="#4B5563" />
            </TouchableOpacity>
            
            <Text className="px-3 py-1 text-gray-900 font-medium">{item.quantity}</Text>
            
            <TouchableOpacity 
              className="px-3 py-2"
              onPress={() => onQuantityChange?.(item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color="#4B5563" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItem;