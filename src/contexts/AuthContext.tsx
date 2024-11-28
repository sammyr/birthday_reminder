'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Here you would typically validate the token and get user data
      try {
        const userData = JSON.parse(localStorage.getItem('user_data') || '');
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (token: string) => {
    try {
      // Here you would typically decode the token and get user data
      // For now, we'll just store the token
      localStorage.setItem('auth_token', token);
      
      // Mock user data - replace this with actual user data from your token
      const userData: User = {
        id: '1',
        email: 'user@example.com',
        name: 'User',
        role: 'user'  // Added the required role field
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
