import Button from '@/components/ui/Button';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  image: any;
  onPress?: () => void;
}

const PromoBanner = ({ 
  title, 
  subtitle, 
  buttonText, 
  image,
  onPress 
}: PromoBannerProps) => {
  return (
    <View className="relative h-48 rounded-xl overflow-hidden mx-4 my-4">
      <Image 
  source={image} 
  className="absolute w-full h-full"
  resizeMode="cover"
/>

      <View className="absolute inset-0 bg-black opacity-30" />
      <View className="absolute inset-0 p-6 justify-center">
        <Text className="text-white text-2xl font-bold mb-1">{title}</Text>
        <Text className="text-white text-lg mb-4">{subtitle}</Text>
        <Button 
          title={buttonText}
          variant="secondary"
          size="small"
          onPress={onPress}
          className="self-start"
        />
      </View>
    </View>
  );
};

export default PromoBanner;