import api from './api.js';

export const authService = {
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('stocklens_token', res.data.token);
      localStorage.setItem('stocklens_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('stocklens_token', res.data.token);
      localStorage.setItem('stocklens_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.user;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    if (res.data?.user) {
      localStorage.setItem('stocklens_user', JSON.stringify(res.data.user));
    }
    return res.data?.user;
  },

  logout() {
    localStorage.removeItem('stocklens_token');
    localStorage.removeItem('stocklens_user');
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('stocklens_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('stocklens_token');
  },
};

