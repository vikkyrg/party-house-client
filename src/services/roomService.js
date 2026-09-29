import { apiClient } from '../lib/apiClient';

export const roomService = {
  getRooms: async (theaterId, params = {}) => {
    const { data } = await apiClient.get(`/rooms/theater/${theaterId}`, { params });
    return data;
  },
  getAllRooms: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/rooms', { params });
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('GET /rooms endpoint not available or forbidden, falling back to fetching per theater:', err);
    }

    try {
      const { data: theatersRes } = await apiClient.get('/theaters', { params });
      const theaters = theatersRes?.data || (Array.isArray(theatersRes) ? theatersRes : []);

      const roomPromises = theaters.map(async (t) => {
        try {
          const { data: roomRes } = await apiClient.get(`/rooms/theater/${t._id || t.id}`, { params });
          return roomRes?.data || (Array.isArray(roomRes) ? roomRes : []);
        } catch {
          return [];
        }
      });

      const roomsArrays = await Promise.all(roomPromises);
      const allRooms = roomsArrays.flat();
      return { data: allRooms, theaters };
    } catch (fallbackErr) {
      throw fallbackErr;
    }
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

