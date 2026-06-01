import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('logicam_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('logicam_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('logicam_token', res.token);
    setUser(res.user);
    return res;
  };

  const loginAgent = async (email, password) => {
    const res = await authApi.loginAgent(email, password);
    localStorage.setItem('logicam_token', res.token);
    const me = await authApi.me();
    setUser(me.user);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('logicam_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAgent, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
