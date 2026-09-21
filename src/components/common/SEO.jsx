import { useEffect } from 'react';

export function SEO({ title, description }) {
  useEffect(() => {
    document.title = 'RIO PARTY HOUSE';
    
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
  }, [title, description]);

  return null;
}
