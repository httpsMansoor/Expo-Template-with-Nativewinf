import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarLabelPosition: 'below-icon', // <-- this puts label below icon
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 70,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ color }) => (
              <Ionicons name="cart-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Promo Button */}
      <TouchableOpacity style={styles.floatingButton}>
        <View style={styles.promoBubble}>
          <Text style={styles.promoTextTop}>UP TO</Text>
          <Text style={styles.promoTextMid}>80%</Text>
          <Text style={styles.promoTextBot}>OFF</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    zIndex: 999,
  },
  promoBubble: {
    backgroundColor: '#FF4D00',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  promoTextTop: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 10,
  },
  promoTextMid: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 18,
  },
  promoTextBot: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
