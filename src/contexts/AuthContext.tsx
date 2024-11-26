'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
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
    const token = Cookies.get('token');
    if (token) {
      // Here you would typically validate the token and get user data
      // This is just a mock implementation
      const userData: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    // Here you would typically decode the token and set user data
    const userData: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    };
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
