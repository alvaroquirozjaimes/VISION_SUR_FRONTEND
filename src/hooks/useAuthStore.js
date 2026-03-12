import { create } from 'zustand';
import { authApi } from '../services/api.js';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    const res = await authApi.login({ email, password });
    localStorage.setItem('token', res.data.token);
    set({ token: res.data.token, user: res.data.user, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  fetchMe: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { set({ initialized: true }); return; }
      const res = await authApi.me();
      set({ user: res.data.user, initialized: true });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null, initialized: true });
    }
  },
}));

export default useAuthStore;
