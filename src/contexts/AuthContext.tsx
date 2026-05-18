import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { User } from '../types';
import { authService, userService } from '../services/api';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshAccessToken: () => Promise<void>; // Expose for testing
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Token refresh interval - refresh 1 minute before expiry (14 minutes)
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<number | null>(null);
  const isRefreshingRef = useRef<boolean>(false);

  // Function to refresh the access token
  const refreshAccessToken = useCallback(async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingRef.current) {
      return;
    }

    try {
      isRefreshingRef.current = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const tokens = await authService.refreshToken();
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // If refresh fails, logout user
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Setup automatic token refresh
  const setupTokenRefresh = useCallback(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Set up new refresh timer
    refreshTimerRef.current = window.setInterval(() => {
      refreshAccessToken();
    }, TOKEN_REFRESH_INTERVAL);
  }, [refreshAccessToken]);

  // Clear token refresh timer
  const clearTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      
      if (accessToken) {
        try {
          const currentUser = await userService.getMe();
          setUser(currentUser);
          // Start automatic token refresh
          setupTokenRefresh();
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      clearTokenRefresh();
    };
  }, [setupTokenRefresh, clearTokenRefresh]);

  const login = async (email: string, password: string) => {
    await authService.signin({ email, password });
    const currentUser = await userService.getMe();
    setUser(currentUser);
    // Start automatic token refresh after login
    setupTokenRefresh();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token refresh timer
      clearTokenRefresh();
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshAccessToken, // Expose for testing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
