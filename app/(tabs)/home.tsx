import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PromoBanner from '../../components/layout/PromoBanner';
import SectionHeader from '../../components/layout/SectionHeader';
import ProductCard from '../../components/product/ProductCard';
import { colors } from '../../constants/colors';
import { getProducts } from '../../lib/api';
import { useCart } from '../context/CartContext';

interface BackendProduct {
  id: string | number;
  name: string;
  price: string | number;
  average_rating?: number;
  review_count?: number;
  image: string;
  discount?: number;
  originalPrice?: number;
  isNew?: boolean;
  [key: string]: any;
}

const HomeScreen = () => {
  const { cartCount } = useCart();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        console.log('Products API response:', data);
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // Sample data - in real app this would come from API
  const categories = [
    { id: 1, name: 'Smartphones', icon: 'phone-portrait' },
    { id: 2, name: 'Laptops', icon: 'laptop' },
    { id: 3, name: 'Headphones', icon: 'headset' },
    { id: 4, name: 'Smart Watches', icon: 'watch' },
    { id: 5, name: 'Cameras', icon: 'camera' },
    { id: 6, name: 'Gaming', icon: 'game-controller' },
  ];

  return (
    <ScrollView className="bg-gray-50 flex-1 pb-16">
      {/* Hero Section */}
      <View className="relative h-80 overflow-hidden">
        <Image 
          source={require('@/assets/images/hero-bg.jpg')} 
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black opacity-30" />
        <View className="absolute inset-0 flex justify-center items-center p-6">
          <Text className="text-white text-4xl font-bold text-center mb-2">
            Tech for the Future
          </Text>
          <Text className="text-white text-lg text-center mb-6">
            Discover the latest gadgets and innovations
          </Text>
          <Link href="../products" asChild>
            <TouchableOpacity className="bg-blue-600 px-8 py-3 rounded-full">
              <Text className="text-white font-bold">Shop Now</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Categories */}
      <SectionHeader title="Categories" linkText="See all" linkUrl="/categories" />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4 py-2"
      >
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/products/category/${category.name.toLowerCase()}`} 
            asChild
          >
            <TouchableOpacity className="items-center mr-6">
              <View className="bg-white w-16 h-16 rounded-full items-center justify-center shadow-sm">
                <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
              </View>
              <Text className="mt-2 text-gray-700">{category.name}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      {/* Promo Banner */}
      <PromoBanner 
        title="Summer Sale"
        subtitle="Up to 50% off on all electronics"
        buttonText="Shop Deals"
        image={require('@/assets/images/promo-banner.jpg')}
      />

      {/* Featured Products (all products for now) */}
      <SectionHeader title="Products" linkText="View all" linkUrl="/products" />
      {loading ? (
        <Text className="px-4 py-8">Loading...</Text>
      ) : error ? (
        <Text className="px-4 py-8 text-red-500">Failed to load products.</Text>
      ) : (
        <View className="flex-row flex-wrap justify-between px-4">
          {Array.isArray(products) && products.map((product) => (
            <View key={product.id} className="w-[48%] mb-6">
              <ProductCard
                product={{
                  id: String(product.id),
                  name: product.name,
                  price: Number(product.price),
                  rating: product.average_rating ?? 0,
                  reviewCount: product.review_count ?? 0,
                  image: product.image ? { uri: product.image } : require('@/assets/images/partial-react-logo.png'),
                  discount: product.discount,
                  originalPrice: product.originalPrice,
                  isNew: product.isNew,
                }}
              />
            </View>
          ))}
        </View>
      )}

      {/* Remove static newArrivals and featuredProducts */}

      {/* Tech Deals */}
      <PromoBanner 
        title="Tech Deals"
        subtitle="Limited time offers on top brands"
        buttonText="Explore Deals"
        image={require('@/assets/images/deals-banner.jpg')}
      />

      {/* Top Brands */}
      <SectionHeader title="Top Brands" />
      <View className="flex-row justify-around p-4 bg-white mx-4 rounded-xl shadow-sm mb-6">
        <Image 
          source={require('@/assets/images/brands/apple.png')} 
          className="w-16 h-16"
          resizeMode="contain"
        />
        <Image 
          source={require('@/assets/images/brands/samsung.png')} 
          className="w-16 h-16"
          resizeMode="contain"
        />
        <Image 
          source={require('@/assets/images/brands/sony.png')} 
          className="w-16 h-16"
          resizeMode="contain"
        />
        <Image 
          source={require('@/assets/images/brands/dell.png')} 
          className="w-16 h-16"
          resizeMode="contain"
        />
      </View>

      {/* Testimonials */}
      <SectionHeader title="What Our Customers Say" />
      <View className="p-4">
        <View className="bg-white p-6 rounded-xl shadow-sm">
          <Ionicons name="chatbubble-outline" size={32} color={colors.gray[300]} className="mb-2" />
          <Text className="text-gray-700 mb-4">
            "The shopping experience at TechHive was amazing! Fast delivery and the product quality exceeded my expectations."
          </Text>
          <Text className="font-bold">Sarah Johnson</Text>
          <Text className="text-gray-500">Verified Customer</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;