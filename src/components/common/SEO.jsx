import { useEffect } from 'react';

export function SEO({ title, description }) {
  useEffect(() => {
    const finalTitle = title || 'RIO PARTY HOUSE';
    document.title = finalTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    metaDescription.content = description || 'RIO PARTY HOUSE offers private celebration spaces and entertainment experiences for birthdays, anniversaries, date nights, and special occasions.';
  }, [title, description]);

  return null;
}
