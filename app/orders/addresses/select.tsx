import Button from "@/components/ui/Button";
import api from "@/lib/api";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const SelectAddressScreen = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/addresses/");
      setAddresses(res.data);
    } catch (err) {
      console.warn("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleSelect = (address: any) => {
    router.push({
      pathname: "/cart/checkout",
      params: {
        selectedAddressId: address.id,
      },
    });
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/orders/addresses/${id}/`);
              setAddresses((prev) => prev.filter((addr) => addr.id !== id));
            } catch (err) {
              Alert.alert("Error", "Failed to delete address");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="p-4 bg-white">
      <Text className="text-2xl font-bold mb-4 text-gray-900">
        Select Address
      </Text>

      <View className="mb-4">
        <Button
          title="➕ Add New Address"
          onPress={() => router.push("/orders/addresses/new")}
        />
      </View>

      {addresses.map((addr) => (
        <View
          key={addr.id}
          className="bg-gray-100 rounded-lg p-4 mb-4 border border-gray-300"
        >
          <TouchableOpacity onPress={() => handleSelect(addr)}>
            <Text className="text-gray-800 font-medium">{addr.full_name}</Text>
            <Text className="text-gray-600">{addr.street_address}</Text>
            <Text className="text-gray-600">
              {addr.city}, {addr.state} {addr.postal_code}
            </Text>
            <Text className="text-gray-600">{addr.country}</Text>
            <Text className="text-gray-600">Phone: {addr.phone}</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View className="flex-row mt-3 space-x-4">
            <View className="flex-1">
              <Button
                title="📝 Edit"
                variant="secondary"
                className="py-2 text-sm"
                onPress={() => router.push(`/orders/addresses/${addr.id}`)}
              />
            </View>
            <View className="flex-1">
              <Button
                title="🗑️ Delete"
                variant="outline"
                className="py-2 text-sm"
                onPress={() => handleDelete(addr.id)}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default SelectAddressScreen;
