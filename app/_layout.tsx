// File: app/_layout.tsx
import Header from '@/components/layout/Header';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './globals.css';

function LayoutContent() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: insets.top > 5 ? insets.top - 50: insets.top,
        paddingBottom: insets.bottom > 5 ? insets.bottom - 60 : insets.bottom,
      }}
    >
      <StatusBar style="dark" hidden={false} />
      <Stack
        screenOptions={{
          header: () => <Header />,
          contentStyle: {
            flex: 1,
            backgroundColor: '#F9FAFB',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="products/[id]" options={{ title: 'Product Details' }} />
        <Stack.Screen name="auth/login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ title: 'Register', headerShown: false }} />
        <Stack.Screen name="auth/forget-pasword" options={{ title: 'Forgot Password', headerShown: false }} />
        <Stack.Screen name="auth/reset-password" options={{ title: 'Reset Password', headerShown: false }} />
        <Stack.Screen name="cart/index" options={{ title: 'Your Cart' }} />
        <Stack.Screen name="cart/checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="orders/index" options={{ title: 'My Orders' }} />
        <Stack.Screen name="orders/[id]" options={{ title: 'Order Details' }} />

      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <LayoutContent />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
