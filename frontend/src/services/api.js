import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const reviewService = {
  create: (text) => api.post('/reviews', { text }),
  getAll: (params) => api.get('/reviews/all', { params }),
  getInsights: () => api.get('/reviews/insights'),
  getTrends: (period) => api.get('/reviews/trends', { params: { period } }),
  getTags: (limit) => api.get('/reviews/tags', { params: { limit } }),
  getClusters: () => api.get('/reviews/clusters'),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const healthService = {
  check: () => api.get('/health'),
};

export default api;

