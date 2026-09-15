import { apiClient } from '../lib/apiClient';

export const paymentService = {
  createOrder: async (bookingId) => {
    const { data } = await apiClient.post('/payment/create-order', { bookingId });
    return data;
  },
  
  verifyPayment: async (paymentData) => {
    const { data } = await apiClient.post('/payment/verify', paymentData);
    return data;
  }
};
