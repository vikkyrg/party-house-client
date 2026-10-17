import { apiClient } from '../lib/apiClient';

export const paymentService = {
  submitUpi: async ({ bookingId, upiTransactionId }) => {
    const { data } = await apiClient.post('/payment/submit-upi', { bookingId, upiTransactionId });
    return data;
  },

  submitUpiPayment: async ({ bookingId, upiTransactionId }) => {
    const { data } = await apiClient.post('/payment/submit-upi', { bookingId, upiTransactionId });
    return data;
  },

  checkStatus: async (bookingId) => {
    const { data } = await apiClient.get(`/payment/status/${bookingId}`);
    return data;
  },
};

export default paymentService;
