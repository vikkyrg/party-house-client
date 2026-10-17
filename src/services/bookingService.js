import { apiClient } from '../lib/apiClient';

export const bookingService = {
  checkAvailability: async (theaterId, date, roomId) => {
    const { data } = await apiClient.get('/bookings/check-availability', {
      params: { theaterId, roomId, date }
    });
    return data;
  },

  createBooking: async (payload) => {
    const { data } = await apiClient.post('/bookings', payload);
    return data;
  },

  createBulkBooking: async (payload) => {
    const { data } = await apiClient.post('/bookings/bulk', payload);
    return data;
  },

  getMyBookings: async () => {
    const { data } = await apiClient.get('/bookings/my');
    return data;
  }
};
