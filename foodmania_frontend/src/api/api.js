import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8000/api',
  withCredentials: true,
});

// Add a request interceptor to handle loading states
api.interceptors.request.use(
  (config) => {
    // You can add loading indicators here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('loginState');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signin', data),
  logout: () => api.get('/auth/logout'),
};

// Dishes API functions
export const dishesAPI = {
  getAll: () => api.get('/dishes'),
  getById: (id) => api.get(`/dishes/${id}`),
  // Add other dish-related endpoints as needed
};

// Cart API functions
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCart: (id, data) => api.put(`/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

// Orders API functions
export const ordersAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

// Export the base api instance for direct usage if needed
export default api;
