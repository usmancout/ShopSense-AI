import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { username: string; email: string; password: string }) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  getProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setUser({ id: '1', ...user });
  };

  const signup = async (data: { username: string; email: string; password: string }) => {
    const res = await axios.post('http://localhost:5000/api/auth/signup', data);
    setUser({ id: '1', ...res.data.user });
  };

  const googleLogin = async (googleAccessToken: string) => {
    const res = await axios.post('http://localhost:5000/api/auth/google-login', {
      access_token: googleAccessToken
    });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setUser({ id: '1', ...user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ id: '1', ...res.data.user }); // This updates all user data, including avatar
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
          'http://localhost:5000/api/auth/password',
          { currentPassword, newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to change password', err);
      throw err;
    }
  };


  return (
      <AuthContext.Provider
          value={{
            user,
            isAuthenticated: !!user,
            login,
            signup,
            googleLogin,
            logout,
            updateProfile,
            getProfile,
            setUser,
            changePassword
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};