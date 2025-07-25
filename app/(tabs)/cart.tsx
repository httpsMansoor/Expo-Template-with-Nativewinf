import { Link, router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/ui/Button';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Sample shipping cost
  const shipping = 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;
  
  return (
    <ScrollView className="bg-gray-50 flex-1 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Your Cart</Text>
      
      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <Text className="text-gray-500 text-lg mb-4">Your cart is empty</Text>
          <Link href="/" asChild>
            <Button title="Continue Shopping" onPress={() => {}} />
          </Link>
        </View>
      ) : (
        <>
          <View className="mb-6">
            {cartItems.map(item => (
              <CartItem 
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
              />
            ))}
          </View>
          
          <CartSummary 
            subtotal={cartTotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onCheckout={() => {
              
              router.push('/cart/checkout');
            }}
          />
          
          <View className="mt-4 flex-row space-x-4">
            <Button 
              title="Clear Cart"
              variant="outline"
              className="flex-1"
              onPress={clearCart}
            />
            <Link href="/" asChild>
              <Button 
                title="Continue Shopping"
                variant="secondary"
                className="flex-1"
                onPress={() => {}}
              />
            </Link>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CartScreen;