// Admin API utilities
import api from './api';

// Use centralized axios instance for admin calls

// Analytics
export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response;
};

// User Management
export const getAllUsers = async (page = 1, limit = 10, search = '') => {
  const response = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
  return response;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// Order Management
export const getAllOrders = async (page = 1, limit = 10, search = '', status = '') => {
  const response = await api.get(`/admin/orders?page=${page}&limit=${limit}&search=${search}&status=${status}`);
  return response;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status, paymentStatus) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status, paymentStatus });
  return response.data;
};

// Dish Management
export const getAllDishes = async (page = 1, limit = 10, search = '', category = '') => {
  const response = await api.get(`/admin/dishes?page=${page}&limit=${limit}&search=${search}&category=${category}`);
  return response;
};

export const createDish = async (dishData) => {
  const response = await api.post('/admin/dishes', dishData);
  return response.data;
};

export const updateDish = async (dishId, dishData) => {
  const response = await api.put(`/admin/dishes/${dishId}`, dishData);
  return response.data;
};

export const deleteDish = async (dishId) => {
  const response = await api.delete(`/admin/dishes/${dishId}`);
  return response.data;
};

// Voucher Management
export const getAllVouchers = async (page = 1, limit = 10, search = '', status = '') => {
  const response = await api.get(`/admin/vouchers?page=${page}&limit=${limit}&search=${search}&status=${status}`);
  return response.data;
};

export const createVoucher = async (voucherData) => {
  const response = await api.post('/admin/vouchers', voucherData);
  return response.data;
};

export const getVoucherById = async (voucherId) => {
  const response = await api.get(`/admin/vouchers/${voucherId}`);
  return response.data;
};

export const updateVoucher = async (voucherId, voucherData) => {
  const response = await api.put(`/admin/vouchers/${voucherId}`, voucherData);
  return response.data;
};

export const deleteVoucher = async (voucherId) => {
  const response = await api.delete(`/admin/vouchers/${voucherId}`);
  return response.data;
};

export const validateVoucher = async (code, orderAmount) => {
  const response = await api.post(`/admin/vouchers/validate/${code}`, { orderAmount });
  return response.data;
};

// Sales Analytics
export const getSalesData = async (filter = 'week', customRange = {}) => {
  try {
    const params = new URLSearchParams({ filter });
    if (filter === 'custom' && customRange.startDate && customRange.endDate) {
      params.append('startDate', customRange.startDate);
      params.append('endDate', customRange.endDate);
    }
    const response = await api.get(`/admin/sales-analytics?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return { data: null };
  }
};

export default {
  getAnalytics,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllDishes,
  createDish,
  updateDish,
  deleteDish,
  getAllVouchers,
  createVoucher,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  getSalesData
};
