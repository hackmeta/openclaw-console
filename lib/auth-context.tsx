'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import type { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await api.getProfile();
        setUser(userData);
        
        // Extract tenant_id from JWT
        const payload = decodeJWT(token);
        if (payload?.tenant_id) {
          setTenantId(payload.tenant_id);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    const response = await api.login(data);
    localStorage.setItem('token', response.access_token);
    setUser(response.user);
    
    // Extract tenant_id from JWT
    const payload = decodeJWT(response.access_token);
    if (payload?.tenant_id) {
      setTenantId(payload.tenant_id);
    }
    
    router.push('/dashboard');
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.register(data);
    localStorage.setItem('token', response.access_token);
    setUser(response.user);
    
    // Extract tenant_id from JWT
    const payload = decodeJWT(response.access_token);
    if (payload?.tenant_id) {
      setTenantId(payload.tenant_id);
    }
    
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTenantId(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, tenantId, loading, login, register, logout }}>
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
