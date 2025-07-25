import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCart } from '@/app/context/CartContext';
import ProductGallery from '@/components/product/ProductGallery';
import Button from '@/components/ui/Button';
import Rating from '@/components/ui/Rating';
import api, { getProductById } from '@/lib/api';

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState('');
  const { addToCart } = useCart();

  const fetchReviews = async (productId: string | number) => {
    try {
      console.log(`📡 Fetching reviews for product ${productId}...`);
      const res = await api.get(`/reviews/products/${productId}/reviews/`);
      console.log('✅ Review API response:', res.data);

      const { reviews: fetchedReviews, average_rating, total_reviews } = res.data;

      if (!Array.isArray(fetchedReviews)) {
        console.warn('⚠️ Expected "reviews" to be an array, but got:', typeof fetchedReviews);
      }

      setReviews(fetchedReviews);
      console.log(`✅ Set ${fetchedReviews.length} reviews`);

      setProduct((prev: any) => ({
        ...prev,
        average_rating,
        review_count: total_reviews,
      }));
    } catch (err) {
      console.error('❌ Failed to fetch reviews:', err);
      setReviews([]);
    }
  };

  useEffect(() => {
    const productId = Array.isArray(id) ? id[0] : id;
    if (productId) {
      console.log(`📦 Fetching product ID: ${productId}`);
      getProductById(productId)
        .then((productData) => {
          console.log('✅ Product fetched:', productData);
          setProduct(productData);
          return fetchReviews(productData.id);
        })
        .catch((err) => {
          console.error('❌ Failed to fetch product:', err);
          setError('Product not found.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          const res = await api.get('/auth/me/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(res.data.email);
          console.log('👤 Logged in as:', res.data.email);
        }
      } catch (err) {
        console.error('❌ Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      price: Number(product.price),
      image: product.image ? { uri: product.image } : require('@/assets/images/placeholder.png'),
      quantity,
    });
    ToastAndroid.show('Item added to cart successfully', ToastAndroid.SHORT);
  };

  const submitReview = async () => {
    if (!reviewRating || !reviewText) return;

    const payload = {
      product: product.id,
      rating: reviewRating,
      comment: reviewText,
    };

    try {
      if (editingReviewId) {
        await api.put(`/reviews/${editingReviewId}/`, payload);
        ToastAndroid.show('Review updated', ToastAndroid.SHORT);
      } else {
        await api.post('/reviews/', payload);
        ToastAndroid.show('Review posted', ToastAndroid.SHORT);
      }

      setReviewText('');
      setReviewRating(0);
      setEditingReviewId(null);

      await fetchReviews(product.id);
    } catch {
      ToastAndroid.show('Review already submitted', ToastAndroid.SHORT);
    }
  };

  const deleteReview = async (id: number) => {
    try {
      await api.delete(`/reviews/${id}/`);
      ToastAndroid.show('Review deleted', ToastAndroid.SHORT);
      await fetchReviews(product.id);
    } catch {
      ToastAndroid.show('Delete failed', ToastAndroid.SHORT);
    }
  };

  const startEdit = (review: any) => {
    setReviewText(review.comment);
    setReviewRating(review.rating);
    setEditingReviewId(review.id);
  };

  if (loading) return <Text style={{ padding: 16 }}>Loading...</Text>;
  if (error || !product) return <Text style={{ padding: 16, color: 'red' }}>{error || 'Product not found.'}</Text>;

  const images = product.image ? [{ uri: product.image }] : [require('@/assets/images/placeholder.png')];

  return (
    <ScrollView style={{ backgroundColor: '#F9FAFB' }}>
      <ProductGallery images={images} />

      <View style={{ padding: 16, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
          {product.name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Rating rating={product.average_rating ?? 0} />
          <Text style={{ marginLeft: 8, color: '#6B7280' }}>
            ({product.review_count ?? 0} reviews)
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2563EB', marginRight: 8 }}>
            ${Number(product.price).toFixed(2)}
          </Text>
          {product.originalPrice && (
            <Text style={{ fontSize: 16, color: '#9CA3AF', textDecorationLine: 'line-through' }}>
              ${Number(product.originalPrice).toFixed(2)}
            </Text>
          )}
        </View>

        <Text style={{ color: '#374151', marginBottom: 16, lineHeight: 22 }}>
          {product.description}
        </Text>

        {/* Reviews */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            Customer Reviews
          </Text>

          <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 4 }}>
            Review count : {product.review_count}
          </Text>

          {Array.isArray(reviews) && reviews.length === 0 ? (
            <Text style={{ color: '#6B7280' }}>No reviews yet.</Text>
          ) : (
            reviews.map((review, index) => {
              console.log(`📝 Rendering review #${index + 1}:`, review);
              return (
                <View key={review.id} style={{ marginBottom: 12, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontWeight: '600', color: '#1F2937' }}>{review.user_full_name}</Text>
                    <Rating rating={review.rating} />
                  </View>
                  <Text style={{ color: '#374151', fontSize: 14, marginBottom: 6 }}>{review.comment}</Text>

                  {review.user === currentUser && (
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity onPress={() => startEdit(review)}>
                        <Text style={{ color: '#3B82F6' }}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteReview(review.id)}>
                        <Text style={{ color: '#EF4444' }}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Add/Edit Review */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            {editingReviewId ? 'Edit Your Review' : 'Leave a Review'}
          </Text>

          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity key={num} onPress={() => setReviewRating(num)}>
                <Ionicons
                  name={reviewRating >= num ? 'star' : 'star-outline'}
                  size={24}
                  color="#F59E0B"
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Write your review..."
            multiline
            value={reviewText}
            onChangeText={setReviewText}
            style={{
              borderColor: '#D1D5DB',
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
          />

          <Button
            title={editingReviewId ? 'Update Review' : 'Submit Review'}
            onPress={submitReview}
          />
        </View>

        {/* Quantity Selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
          <Text style={{ color: '#374151', fontWeight: '500' }}>Quantity</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 8 }}>
            <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
              <Ionicons name="remove" size={18} color="#4B5563" />
            </TouchableOpacity>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 6, fontWeight: '600', fontSize: 16, color: '#111827' }}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(q => q + 1)} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
              <Ionicons name="add" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart / Buy Now */}
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
          <Button
            title="Add to Cart"
            variant="outline"
            className="flex-1"
            icon={<Ionicons name="cart-outline" size={18} color="#3B82F6" />}
            onPress={handleAddToCart}
          />
          <Button
            title="Buy Now"
            className="flex-1"
            onPress={() => {
              handleAddToCart();
              router.push('/cart/checkout');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;
