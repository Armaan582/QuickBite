import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('foodie_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount or token change
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('foodie_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      localStorage.setItem('foodie_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('foodie_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.data.success) {
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const addAddress = async (addressData) => {
    const res = await authAPI.addAddress(addressData);
    if (res.data.success) {
      setUser((prev) => ({
        ...prev,
        addresses: res.data.addresses
      }));
      return res.data.addresses;
    }
  };

  const deleteAddress = async (addressId) => {
    const res = await authAPI.deleteAddress(addressId);
    if (res.data.success) {
      setUser((prev) => ({
        ...prev,
        addresses: res.data.addresses
      }));
      return res.data.addresses;
    }
  };

  const setDefaultAddress = async (addressId) => {
    const res = await authAPI.setDefaultAddress(addressId);
    if (res.data.success) {
      setUser((prev) => ({
        ...prev,
        addresses: res.data.addresses
      }));
      return res.data.addresses;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isCustomer: user?.role === 'user',
        isOwner: user?.role === 'restaurant_owner',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress
      }}
    >
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
