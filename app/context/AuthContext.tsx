import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // Optionally fetch user info from backend using token
        setUser({ id: '', name: '', email: '' }); // Set minimal user or fetch real user
      }
    };
    loadToken();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);
      // Save tokens if present
      if (data.access) {
        await AsyncStorage.setItem('authToken', data.access);
      }
      setUser({
        id: data.id?.toString() || '',
        name: data.full_name || '',
        email: data.email,
      });
    } catch (err) {
      throw err;
    }
  };
  
  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('authToken');
  };
  
  const register = async (full_name: string, email: string, password: string) => {
    try {
      const data = await apiRegister(full_name, email, password);
      setUser({
        id: data.id?.toString() || '',
        name: data.full_name || '',
        email: data.email,
      });
    } catch (err) {
      throw err;
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};