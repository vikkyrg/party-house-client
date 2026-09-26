import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import { ImagePreviewModal } from '../components/common/ImagePreviewModal';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { motion } from 'framer-motion';
import { ArrowRight, Film, PartyPopper, Coffee, Cake, Star } from 'lucide-react';

export function ServicesPage() {
  const [previewImage, setPreviewImage] = useState(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: contentService.getServices,
  });

  const services = response?.data || [];

  const getIconForService = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('movie') || t.includes('screen')) return Film;
    if (t.includes('decor') || t.includes('event')) return PartyPopper;
    if (t.includes('snack') || t.includes('beverage') || t.includes('food')) return Coffee;
    if (t.includes('cake')) return Cake;
    return Star;
  };

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
           <span>More</span>
           <span>Than Movies</span>
         </div>
      </div>

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 2xl:px-32 relative z-10 max-w-[1440px]">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-[#c2a290]"></div>
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#9e6223]">
              OUR SERVICES
            </span>
            <div className="h-[1px] w-12 bg-[#c2a290]"></div>
          </div>
          
          <h1 className="text-[40px] md:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
            RIO PARTY HOUSE – <span className="text-[#a54c13]">Services</span>
          </h1>
          
          <h2 className="text-[18px] md:text-[22px] font-heading font-bold text-[#1a1c21] mb-3">
            More than movies. We create experiences.
          </h2>
          
          <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] max-w-2xl leading-[1.6]">
            From private screenings to decorations, food, photography and more —<br className="hidden md:block" /> we take care of every detail to make your moments unforgettable.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col gap-24">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex flex-col md:flex-row gap-12 md:gap-20 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                 <div className="w-full md:w-1/2 h-[350px] bg-gray-200 animate-pulse rounded-[24px]"></div>
                 <div className="w-full md:w-1/2">
                   <div className="h-10 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>
                   <div className="h-4 w-full bg-gray-100 rounded mb-3 animate-pulse"></div>
                   <div className="h-4 w-5/6 bg-gray-100 rounded mb-3 animate-pulse"></div>
                   <div className="h-12 w-32 bg-gray-200 rounded-full mt-6 animate-pulse"></div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              const Icon = getIconForService(service.title);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  key={service._id} 
                  className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${isEven ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Image Section */}
                  <div 
                    className="w-full md:w-[45%] rounded-[24px] overflow-hidden cursor-pointer relative group shadow-[0_20px_40px_rgba(0,0,0,0.12)] border-4 border-white shrink-0 bg-[#f4e7da] flex items-center justify-center"
                    onClick={() => setPreviewImage(getImageUrl(service.image))}
                  >
                    <img 
                      src={getImageUrl(service.image)} 
                      alt={service.title} 
                      onError={handleImageError}
                      className="w-full h-auto object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-[#1a1c21] text-sm font-bold px-5 py-2.5 rounded-full transition-opacity shadow-md">
                        Preview Image
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full md:w-[55%] flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-[#a54c13]">
                        <Icon strokeWidth={1.5} size={32} />
                      </div>
                      <h3 className="text-3xl font-heading font-extrabold text-[#1a1c21]">{service.title}</h3>
                    </div>
                    
                    <p className="text-[#6b5c52] text-[15px] leading-[1.7] mb-8 font-medium break-words whitespace-pre-wrap">
                      {service.description}
                    </p>
                    
                    {service.features && service.features.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-8">
                        {service.features.map((feature, i) => (
                          <span key={i} className="bg-[#f5e6d6] text-[#8c5211] text-[12px] font-bold px-4 py-2 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </motion.div>
              );
            })}
            {services.length === 0 && (
               <div className="text-center py-20 text-[#6b5c52] font-medium text-lg bg-white rounded-[32px] shadow-sm border border-[#f0e6dd]">
                 No services available at the moment.
               </div>
            )}
          </div>
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
