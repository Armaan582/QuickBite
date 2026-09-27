import axios from 'axios';

// In development the relative URL goes through Vite's localhost:5000 proxy.
// In a deployed build VITE_API_BASE_URL should be the Render service origin,
// for example https://quickbite-qeos.onrender.com (without a trailing /api).
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
const apiBaseUrl = import.meta.env.DEV
  ? '/api'
  : `${configuredApiBaseUrl || 'https://quickbite-qeos.onrender.com'}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem('foodie_token');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  addAddress: (address) => api.post('/auth/addresses', address),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/auth/addresses/${id}/default`)
};

// Restaurants API
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getCuisines: () => api.get('/restaurants/cuisines'),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMyRestaurant: () => api.get('/restaurants/owner/me'),
  updateMyRestaurant: (data) => api.post('/restaurants/owner/profile', data),
  toggleStatus: () => api.patch('/restaurants/owner/toggle-status')
};

// Menu API
export const menuAPI = {
  getByRestaurant: (restaurantId) => api.get(`/menu/${restaurantId}`),
  addItem: (data) => api.post('/menu', data),
  updateItem: (id, data) => api.put(`/menu/${id}`, data),
  deleteItem: (id) => api.delete(`/menu/${id}`),
  toggleAvailability: (id) => api.patch(`/menu/${id}/toggle-availability`)
};

// Orders API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getRestaurantOrders: (params) => api.get('/orders/restaurant/orders', { params }),
  updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
  getOwnerAnalytics: () => api.get('/orders/restaurant/analytics')
};

// Reviews API
export const reviewAPI = {
  getByRestaurant: (restaurantId) => api.get(`/reviews/restaurant/${restaurantId}`),
  add: (data) => api.post('/reviews', data)
};

// Coupons API
export const couponAPI = {
  validate: (data) => api.post('/coupons/validate', data),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  toggleStatus: (id) => api.patch(`/coupons/${id}/toggle`),
  delete: (id) => api.delete(`/coupons/${id}`)
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  getRestaurants: (params) => api.get('/admin/restaurants', { params }),
  approveRestaurant: (id, isApproved) => api.patch(`/admin/restaurants/${id}/approve`, { isApproved }),
  toggleFeatured: (id) => api.patch(`/admin/restaurants/${id}/toggle-featured`),
  getOrders: (params) => api.get('/admin/orders', { params })
};

export default api;
