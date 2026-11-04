import { apiClient } from '../lib/apiClient';

export const paymentService = {
  submitUpi: async ({ bookingId, paymentAmount, upiTransactionId, transactionReference }) => {
    const { data } = await apiClient.post('/payment/submit-upi', {
      bookingId,
      paymentAmount,
      upiTransactionId,
      transactionReference,
    });
    return data;
  },

  submitUpiPayment: async ({ bookingId, paymentAmount, upiTransactionId, transactionReference }) => {
    const { data } = await apiClient.post('/payment/submit-upi', {
      bookingId,
      paymentAmount,
      upiTransactionId,
      transactionReference,
    });
    return data;
  },

  checkStatus: async (bookingId) => {
    const { data } = await apiClient.get(`/payment/status/${bookingId}`);
    return data;
  },
};

export default paymentService;
