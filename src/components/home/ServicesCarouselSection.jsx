import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contentService } from '../../services/contentService';
import { getImageUrl } from '../../utils/imageUtils';

export function ServicesCarouselSection() {
  const { data: response } = useQuery({
    queryKey: ['services'],
    queryFn: contentService.getServices,
  });

  const allServices = response?.data || [];
  const services = allServices.filter(s => s.isActive);

  if (services.length === 0) return null;

  return (
    <section className="py-24 bg-surface-container-low relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 bg-[#8c5211]"></div>
              <span className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-[#8c5211]">
                OUR SERVICES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading text-[#1a1c21] font-extrabold leading-tight mb-4">
              Everything You Need <br className="hidden md:block"/>for the Celebration.
            </h2>
            <p className="text-[#6b5c52] font-medium text-[16px] leading-relaxed">
              Personalize your private cinema experience with cakes, gifts, decorations and more.
            </p>
          </div>
          
          {/* Navigation Controls removed as it is now continuously moving */}
        </div>

        {/* Continuous Carousel Window */}
        <div className="overflow-hidden w-full relative -mx-4 px-4 pb-12 pt-4 flex">
          {services.length > 0 && (
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              className="flex w-max gap-6"
            >
              {[...Array(2)].flatMap(() => services).map((item, idx) => (
                <div key={idx} className="w-[300px] md:w-[320px] shrink-0 h-[320px]">
                  <Link to="/services" className="block group h-full">
                    <div className="relative bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#f0e6dd] flex flex-col overflow-hidden text-left h-full transition-transform group-hover:-translate-y-2 duration-300 transform-gpu group-hover:shadow-[0_10px_30px_rgba(140,82,17,0.12)]">
                      
                      {/* Image Section */}
                      <div className="relative h-[240px] w-full overflow-hidden shrink-0 bg-[#0F1014]">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.title} 
                          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
                        />
                      </div>
                      
                      {/* Content Section */}
                      <div className="relative px-6 py-5 flex flex-col flex-grow bg-white z-10 -mt-[1px] justify-center items-center">
                        <h3 className="text-[17px] font-bold text-[#1a1c21] text-center w-full truncate">
                          {item.title}
                        </h3>
                      </div>
                      
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
