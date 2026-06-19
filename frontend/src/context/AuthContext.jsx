import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('logitech_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('logitech_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    console.log('[AuthContext] login() appelé avec email:', email);
    try {
      const res = await authApi.login(email, password);
      console.log('[AuthContext] authApi.login() réponse:', res);
      localStorage.setItem('logitech_token', res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      console.error('[AuthContext] login() erreur:', err);
      throw err;
    }
  };

  const loginAgent = async (email, password) => {
    try {
      const res = await authApi.loginAgent(email, password);
      localStorage.setItem('logitech_token', res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const res = await authApi.loginAdmin(email, password);
      localStorage.setItem('logitech_token', res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const updateProfile = async (payload) => {
    const res = await authApi.updateProfile(payload);
    const me = await authApi.me();
    setUser(me.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('logitech_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAgent, loginAdmin, logout, setUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
