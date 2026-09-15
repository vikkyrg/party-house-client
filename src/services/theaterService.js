import { apiClient } from '../lib/apiClient';

export const theaterService = {
  getTheaters: async (params) => {
    const { data } = await apiClient.get('/theaters', { params });
    return data;
  },

  getTheaterById: async (id) => {
    const { data } = await apiClient.get(`/theaters/${id}`);
    return data;
  },

  getAvailability: async (id, date) => {
    const { data } = await apiClient.get(`/theaters/${id}/availability`, { params: { date } });
    return data;
  }
};
