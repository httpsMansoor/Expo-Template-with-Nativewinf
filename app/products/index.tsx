// File: app/products/index.tsx
import SectionHeader from '@/components/layout/SectionHeader';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

interface BackendProduct {
  id: string | number;
  name: string;
  price: string | number;
  average_rating?: number;
  review_count?: number;
  image: string | null;
  discount?: number;
  originalPrice?: number;
  isNew?: boolean;
  [key: string]: any;
}

const ProductsScreen = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView className="bg-gray-50 flex-1 pb-16">
      <SectionHeader title="All Products" />
      {loading ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-2">Loading products...</Text>
        </View>
      ) : error ? (
        <Text className="px-4 py-8 text-red-500 text-center">{error}</Text>
      ) : (
        <View className="flex-row flex-wrap justify-between px-4">
          {products.map((product) => (
            <View key={product.id} className="w-[48%] mb-6">
              <ProductCard
                product={{
                  id: String(product.id),
                  name: product.name,
                  price: Number(product.price),
                  rating: product.average_rating ?? 0,
                  reviewCount: product.review_count ?? 0,
                  image: product.image ? { uri: product.image } : require('@/assets/images/placeholder.png'),
                  discount: product.discount,
                  originalPrice: product.originalPrice,
                  isNew: product.isNew,
                }}
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ProductsScreen;
