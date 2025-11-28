import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { useRouter } from 'next/router';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('bb_token');
    const u = localStorage.getItem('bb_user');
    if (t) { setToken(t); setAuthToken(t); }
    if (u) setUser(JSON.parse(u));
  }, []);

  const saveAuth = (t, u) => {
    setToken(t); setUser(u);
    localStorage.setItem('bb_token', t);
    localStorage.setItem('bb_user', JSON.stringify(u));
    setAuthToken(t);
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    saveAuth(res.data.token, res.data.user);
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveAuth(res.data.token, res.data.user);
  };

  const createBusiness = async (formData) => {
    const res = await api.post('/businesses', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
    setToken(null); setUser(null);
    setAuthToken(null);
    router.push('/');
  };

  const ensureAuthed = () => {
    if (!localStorage.getItem('bb_token')) router.push('/login');
  };

  return (
    <Ctx.Provider value={{ 
      user, 
      token, 
      register, 
      login, 
      createBusiness, 
      logout, 
      ensureAuthed 
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);