import { apiClient } from '../lib/apiClient';

export const contentService = {
  getEventTypes: async () => {
    const { data } = await apiClient.get('/event-types');
    return data;
  },
  
  getAddons: async () => {
    const { data } = await apiClient.get('/addons');
    return data;
  },
  
  getBanners: async (position = '') => {
    const query = position ? `?position=${position}` : '';
    const { data } = await apiClient.get(`/banners${query}`);
    return data;
  },
  
  getFaqs: async () => {
    const { data } = await apiClient.get('/faqs');
    return data;
  },
  
  getTestimonials: async () => {
    const { data } = await apiClient.get('/testimonials');
    return data;
  },
  
  getServices: async () => {
    const { data } = await apiClient.get('/services');
    return data;
  },
  
  getGallery: async () => {
    const { data } = await apiClient.get('/gallery');
    return data;
  },
  
  getStories: async () => {
    const { data } = await apiClient.get('/stories');
    return data;
  }
};
