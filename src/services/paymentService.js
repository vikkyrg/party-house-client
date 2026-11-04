import { apiClient } from '../lib/apiClient';

export const paymentService = {
  submitUpi: async ({ bookingId, paymentAmount, transactionReference, upiTransactionId }) => {
    const { data } = await apiClient.post('/payment/submit-upi', {
      bookingId,
      paymentAmount,
      transactionReference,
      upiTransactionId,
    });
    return data;
  },

  submitUpiPayment: async ({ bookingId, paymentAmount, transactionReference, upiTransactionId }) => {
    const { data } = await apiClient.post('/payment/submit-upi', {
      bookingId,
      paymentAmount,
      transactionReference,
      upiTransactionId,
    });
    return data;
  },

  checkStatus: async (bookingId) => {
    const { data } = await apiClient.get(`/payment/status/${bookingId}`);
    return data;
  },
};

export default paymentService;
