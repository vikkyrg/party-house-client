import { apiClient } from '../lib/apiClient';

export const bookingService = {
  checkAvailability: async (theaterId, date, roomId) => {
    const { data } = await apiClient.get('/bookings/check-availability', {
      params: { theaterId, roomId, date }
    });
    return data;
  },

  createHold: async (payload) => {
    const { data } = await apiClient.post('/bookings/hold', payload);
    return data;
  },

  releaseHold: async (holdId) => {
    const { data } = await apiClient.delete(`/bookings/hold/${holdId}`);
    return data;
  },

  getDraft: async (draftId) => {
    const { data } = await apiClient.get(`/bookings/drafts/${draftId}`);
    return data;
  },

  saveDraft: async (draftId, payload) => {
    const { data } = await apiClient.put(`/bookings/drafts/${draftId}`, payload);
    return data;
  },

  deleteDraft: async (draftId) => {
    const { data } = await apiClient.delete(`/bookings/drafts/${draftId}`);
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
  },

  getCurrentSessionBooking: async () => {
    const { data } = await apiClient.get('/bookings/current-session');
    return data;
  }
};
