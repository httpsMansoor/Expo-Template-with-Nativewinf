import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, TouchableOpacity, View } from 'react-native';

interface ProductGalleryProps {
  images: any[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { width } = Dimensions.get('window');

  return (
    <View className="mb-4">
      <View className="relative">
        <Image 
          source={images[selectedImage]} 
          className="w-full rounded-xl"
          style={{ height: width * 0.8 }}
          resizeMode="contain"
        />
        <TouchableOpacity className="absolute top-4 right-4 bg-white p-2 rounded-full">
          <Ionicons name="heart-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mt-3 px-2"
      >
        {images.map((img, index) => (
          <TouchableOpacity 
            key={index} 
            className={`mr-3 border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'} rounded-lg`}
            onPress={() => setSelectedImage(index)}
          >
            <Image 
              source={img} 
              className="w-16 h-16 rounded-md"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProductGallery;