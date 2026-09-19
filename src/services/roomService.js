import { apiClient } from '../lib/apiClient';

export const roomService = {
  getRooms: async (theaterId, params = {}) => {
    const { data } = await apiClient.get(`/rooms/theater/${theaterId}`, { params });
    return data;
  },
  getRoom: async (roomId) => {
    const { data } = await apiClient.get(`/rooms/${roomId}`);
    return data;
  },
  getAvailability: async (roomId, date) => {
    const { data } = await apiClient.get(`/rooms/${roomId}/availability`, { params: { date } });
    return data;
  },
};
