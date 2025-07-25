import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Rating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={16} color="#F59E0B" />
      ))}
      {halfStar && (
        <Ionicons name="star-half" size={16} color="#F59E0B" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#F59E0B" />
      ))}
      <Text className="text-gray-500 ml-1">({rating.toFixed(1)})</Text>
    </View>
  );
};

export default Rating;