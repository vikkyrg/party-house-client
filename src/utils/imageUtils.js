export const getImageUrl = (img) => {
  if (!img) return null;
  const url = typeof img === 'string' ? img : (img.url || img.data);
  if (!url) return null;

  if (url.startsWith('data:image')) {
    return url;
  }

  // Handle raw base64 strings
  if (url.length > 100 && !url.startsWith('http') && !url.startsWith('/')) {
    const mimeType = url.startsWith('iVBORw0KGgo') ? 'image/png' : 
                     url.startsWith('/9j/') ? 'image/jpeg' : 
                     url.startsWith('R0lGOD') ? 'image/gif' : 
                     url.startsWith('UklGR') ? 'image/webp' : 'image/jpeg';
    return `data:${mimeType};base64,${url}`;
  }

  if (url.startsWith('/api/')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    const host = baseUrl.replace('/api/v1', '');
    return `${host}${url}`;
  }
  
  return url;
};
