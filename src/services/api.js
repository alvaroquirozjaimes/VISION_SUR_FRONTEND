import axios from 'axios';

// URL base del backend para imágenes y archivos estáticos
export const BACKEND_URL = 'http://localhost:4000';

// Convierte rutas relativas /uploads/... a URLs absolutas
export function assetUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
}

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── News
export const newsApi = {
  getAll: (params) => api.get('/news', { params }),
  getBySlug: (slug) => api.get(`/news/${slug}`),
  getAllAdmin: (params) => api.get('/admin/news', { params }),
  create: (data) => api.post('/admin/news', data),
  update: (id, data) => api.put(`/admin/news/${id}`, data),
  delete: (id) => api.delete(`/admin/news/${id}`),
};

// ── Videos
export const videoApi = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  getAllAdmin: (params) => api.get('/admin/videos', { params }),
  create: (data) => api.post('/admin/videos', data),
  update: (id, data) => api.put(`/admin/videos/${id}`, data),
  delete: (id) => api.delete(`/admin/videos/${id}`),
};

// ── Programs
export const programApi = {
  getAll: () => api.get('/programs'),
  getLiveStream: () => api.get('/livestream'),
  getAllAdmin: () => api.get('/admin/programs'),
  create: (data) => api.post('/admin/programs', data),
  update: (id, data) => api.put(`/admin/programs/${id}`, data),
  delete: (id) => api.delete(`/admin/programs/${id}`),
  updateLiveStream: (url) => api.put('/admin/livestream', { url }),
};

// ── Users
export const userApi = {
  getAll: () => api.get('/admin/users'),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

// ── Contact
export const contactApi = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/admin/contacts', { params }),
  updateStatus: (id, status) => api.put(`/admin/contacts/${id}/status`, { status }),
  delete: (id) => api.delete(`/admin/contacts/${id}`),
};

// ── Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};
