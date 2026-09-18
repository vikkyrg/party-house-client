import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { ImagePreviewModal } from '../components/common/ImagePreviewModal';
import { motion } from 'framer-motion';

export function GalleryPage() {
  const [previewImage, setPreviewImage] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: contentService.getGallery,
  });

  const galleryItems = response?.data || [];

  // Group by category if needed, or just show all
  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-16 px-5 max-w-[1440px] mx-auto">
      <h1 className="text-4xl font-heading font-black text-[#181533] mb-8 text-center">Gallery</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Take a look at some of the beautiful moments captured at our venues.</p>
      
      {!isLoading && categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-[#8c5211] text-white shadow-md' 
                  : 'bg-[#FAF4ED] text-[#6b5c52] hover:bg-[#F0E6DD]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
             <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item._id}
              className="aspect-square relative rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-[#f0e6dd]"
              onClick={() => setPreviewImage(item.image)}
            >
              <img 
                src={item.image} 
                alt={item.title || 'Gallery Image'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  {item.title && <p className="text-white font-medium truncate mb-1">{item.title}</p>}
                  <span className="text-white/80 text-xs bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                    Click to preview
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500">
               No gallery items found.
             </div>
          )}
        </div>
      )}

      <ImagePreviewModal 
        isOpen={!!previewImage} 
        imageUrl={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />
    </div>
  );
}
