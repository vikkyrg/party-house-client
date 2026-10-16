import { apiClient } from '../lib/apiClient';

export const contentService = {
  getEventTypes: async () => {
    const { data } = await apiClient.get('/event-types');
    return data;
  },
  
  getEventTypeBySlugOrId: async (slugOrId) => {
    const { data } = await apiClient.get(`/event-types/${slugOrId}`);
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
  },

  getPublicReviews: async () => {
    const { data } = await apiClient.get('/reviews/public');
    return data;
  },

  submitContactMessage: async (formData) => {
    const { data } = await apiClient.post('/contact', formData);
    return data;
  },

  subscribeNewsletter: async (payload) => {
    const { data } = await apiClient.post('/newsletter/subscribe', payload);
    return data;
  },

  unsubscribeNewsletter: async (payload) => {
    const { data } = await apiClient.post('/newsletter/unsubscribe', payload);
    return data;
  }
};

