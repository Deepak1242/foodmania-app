import api from './api';

const checkoutAPI = {
  // Create checkout session
  createCheckoutSession: async (data) => {
    const response = await api.post('/checkout/create-session', data);
    return response.data;
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    const response = await api.get(`/checkout/order/${orderId}`);
    return response.data;
  },

  // Update delivery status
  updateDeliveryStatus: async (orderId, data) => {
    const response = await api.put(`/checkout/order/${orderId}/delivery`, data);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get('/orders/user');
    return response.data;
  }
};

export default checkoutAPI;
