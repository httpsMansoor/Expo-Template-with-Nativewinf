import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const BASE_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = 'https://web-production-ad8ec.up.railway.app/api';
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Endpoints that don't need a token
const PUBLIC_ENDPOINTS = [
  '/auth/token/',
  '/auth/register/',
  '/auth/send-reset-password-link/',
  '/auth/reset-password/',
  '/auth/verify-registration/',
  '/products/products/',
  '/products/categories/',
];

// Request interceptor to attach token conditionally
api.interceptors.request.use(
  async (config) => {
    const isPublic = PUBLIC_ENDPOINTS.some((path) =>
      config.url?.startsWith(path)
    );

    if (!isPublic) {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response.data?.code === 'token_not_valid';

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        await AsyncStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ------------------- Product APIs -------------------
export const getProducts = async () => {
  const res = await api.get('/products/products/');
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/products/products/${id}/`);
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get('/products/categories/');
  return res.data;
};

export const getProductReviews = async (productId: string) => {
  try {
    const res = await api.get(`/reviews/products/${productId}/reviews/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
};

// ------------------- Auth APIs -------------------
export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/token/', { email, password });
  await AsyncStorage.setItem('accessToken', res.data.access);
  await AsyncStorage.setItem('refreshToken', res.data.refresh);
  return res.data;
};

export const register = async (full_name: string, email: string, password: string) => {
  const res = await api.post('/auth/register/', { full_name, email, password });
  return res.data;
};

export const sendResetPasswordLink = async (email: string) => {
  const res = await api.post('/auth/send-reset-password-link/', { email });
  return res.data;
};

export const resetPassword = async (
  userId: string,
  timestamp: number,
  signature: string,
  password: string
) => {
  const res = await api.post('/auth/reset-password/', {
    user_id: userId,
    timestamp,
    signature,
    password,
  });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await api.get('/auth/me/');
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};

// ------------------- Checkout & Orders APIs -------------------
export const createCheckout = async (data: {
  payment_method: 'COD' | 'VISA' | 'MC' | 'PP',
  full_name: string,
  street_address: string,
  city: string,
  state: string,
  postal_code: string,
  country: string,
  phone: string,
  email: string
}) => {
  const res = await api.post('/orders/checkout/', data);
  return res.data;
};

export const confirmOrder = async (orderId: string) => {
  const res = await api.post(`/orders/confirm/${orderId}/`);
  return res.data;
};

export const cancelOrder = async (orderId: string) => {
  const res = await api.post(`/orders/cancel/${orderId}/`);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get('/orders/my/');
  return res.data;
};

export const getOrderById = async (orderId: string) => {
  const res = await api.get(`/orders/${orderId}/`);
  return res.data;
};

export default api;
