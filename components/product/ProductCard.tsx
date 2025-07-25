import Badge from '@/components/ui/Badge';
import Rating from '@/components/ui/Rating';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../app/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviewCount: number;
    image: any;
    discount?: number;
    originalPrice?: number;
    isNew?: boolean;
  };
  onAddToCartSuccess?: () => void;
}

const ProductCard = ({ product, onAddToCartSuccess }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Link href={`/products/${product.id}`} asChild>
      <TouchableOpacity className="bg-white rounded-xl shadow-sm overflow-hidden mb-3 w-44 h-72">
        <View className="relative">
          <Image 
            source={product.image} 
            className="w-full h-36 rounded-t-xl"
            resizeMode="cover"
          />

          {(product.discount || product.isNew) && (
            <View className="absolute top-2 right-2 z-10 flex-row space-x-1">
              {product.discount && (
                <Badge text={`${product.discount}% OFF`} variant="danger" />
              )}
              {product.isNew && (
                <Badge text="NEW" variant="success" />
              )}
            </View>
          )}

          <TouchableOpacity className="absolute top-2 left-2 bg-white p-1.5 rounded-full shadow-sm z-10">
            <Ionicons name="heart-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View className="px-2 py-2 flex-1 justify-between">
          <Text className="font-medium text-sm text-gray-900" numberOfLines={2}>
            {product.name}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-end">
              <Text className="text-base font-semibold text-gray-900 mr-1">
                ${product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text className="text-xs text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>

            <TouchableOpacity 
              className="bg-blue-100 p-1.5 rounded-full ml-2" 
              onPress={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  quantity: 1,
                });

                if (onAddToCartSuccess) {
                  onAddToCartSuccess();
                } else {
                  ToastAndroid.show('Item added to cart successfully', ToastAndroid.SHORT);
                }
              }}
            >
              <Ionicons name="cart-outline" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mt-1">
            <Rating rating={product.rating} size={14} />
            <Text className="text-gray-500 text-xs ml-1">({product.reviewCount})</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ProductCard;
