import { apiClient } from '../lib/apiClient';

export const bookingService = {
  checkAvailability: async (theaterId, date) => {
    const { data } = await apiClient.get('/bookings/check-availability', {
      params: { theaterId, date }
    });
    return data;
  },

  createBooking: async (payload) => {
    // Requires Auth Token which is handled by interceptor or passed manually
    const { data } = await apiClient.post('/bookings', payload);
    return data;
  },

  getMyBookings: async () => {
    const { data } = await apiClient.get('/bookings/my');
    return data;
  }
};
