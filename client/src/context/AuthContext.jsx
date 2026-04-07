import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api') + '/auth';

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      const data = response.data;
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || 'Server connection error' };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/register`, { email, password });
      const data = response.data;
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.response?.data?.message || 'Server connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
