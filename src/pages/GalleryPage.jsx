import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { ImagePreviewModal } from '../components/common/ImagePreviewModal';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      {/* Background Film Strip SVG (Top Right) */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      {/* Background Film Strip SVG (Bottom Left) */}
      <div className="absolute bottom-10 -left-20 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(0, 600)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      {/* Right Cursive Logo Overlap */}
      <div className="absolute top-32 right-12 pointer-events-none z-10 hidden xl:block">
         <div className="font-[cursive] text-[36px] text-[#c2a290] leading-[1.1] transform -rotate-12 opacity-80 pr-8 flex flex-col items-end">
           <span>Capture</span>
           <span>The Moment</span>
         </div>
      </div>

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 2xl:px-32 relative z-10 max-w-[1440px]">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-[#c2a290]"></div>
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#9e6223]">
              OUR GALLERY
            </span>
            <div className="h-[1px] w-12 bg-[#c2a290]"></div>
          </div>
          
          <h1 className="text-[40px] md:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
            CS Cinemas – <span className="text-[#a54c13]">Gallery</span>
          </h1>
          
          <h2 className="text-[18px] md:text-[22px] font-heading font-bold text-[#1a1c21] mb-3">
            A glimpse into our beautiful celebrations.
          </h2>
          
          <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] max-w-2xl leading-[1.6]">
            Take a look at some of the beautiful moments captured at our venues. Browse through our carefully curated categories.
          </p>
        </div>

        {!isLoading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-colors border shadow-sm ${
                  activeCategory === category 
                    ? 'bg-[#8c480f] text-white border-[#8c480f]' 
                    : 'bg-white text-[#6b5c52] border-[#eaddd0] hover:bg-[#f5e6d6] hover:text-[#8c5211]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className="aspect-square bg-gray-200 rounded-[24px] animate-pulse border-4 border-white shadow-lg"></div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item._id}
                  className="aspect-square relative rounded-[24px] overflow-hidden cursor-pointer group shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-4 border-white"
                  onClick={() => setPreviewImage(item.image)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title || 'Gallery Image'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title && <p className="text-white font-bold text-lg truncate mb-1">{item.title}</p>}
                      <span className="inline-flex items-center gap-1.5 text-white/90 text-[11px] font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Preview Image
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredItems.length === 0 && (
               <div className="col-span-full text-center py-20 text-[#6b5c52] font-medium text-lg bg-white rounded-[32px] shadow-sm border border-[#f0e6dd]">
                 No gallery items found for this category.
               </div>
            )}
          </motion.div>
        )}
      </div>

      <ImagePreviewModal 
        isOpen={!!previewImage} 
        imageUrl={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />
    </div>
  );
}
