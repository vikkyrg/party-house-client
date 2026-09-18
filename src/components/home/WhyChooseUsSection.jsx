import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Heart, CheckCircle2, LayoutGrid } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { getImageUrl } from '../../utils/imageUtils';

export function WhyChooseUsSection() {
  const navigate = useNavigate();

  // Fetch gallery images
  const { data: galleryResponse } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => contentService.getGallery(),
  });

  const allImages = galleryResponse?.data || [];
  // Filter active images
  const activeImages = allImages.filter(img => img.isActive);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 1.5s
  useEffect(() => {
    if (activeImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [activeImages.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const benefits = [
    {
      icon: <Star className="w-5 h-5 text-[#8c5211]" />,
      title: "Private & Personal",
      desc: "Your theater is reserved exclusively for your group."
    },
    {
      icon: <LayoutGrid className="w-5 h-5 text-[#8c5211]" />,
      title: "Premium Cinema Experience",
      desc: "Enjoy immersive sound, high-quality projection and comfortable private seating."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#8c5211]" />,
      title: "Celebration Ready",
      desc: "Add decorations, cakes, gifts and other services."
    },
    {
      icon: <Heart className="w-5 h-5 text-[#8c5211]" />,
      title: "Flexible Experiences",
      desc: "Perfect for birthdays, anniversaries, date nights, proposals and special occasions."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#8c5211]" />,
      title: "Easy Booking",
      desc: "Select your location, theater and available time slot before customizing your celebration."
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <div className="w-full lg:w-[50%] flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[#8c5211]"></div>
              <span className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-[#8c5211]">
                WHY CHOOSE US
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-heading text-[#1a1c21] font-extrabold leading-tight mb-6">
              Why Celebrate <br className="hidden md:block"/>
              at CS Cinemas?
            </h2>
            
            <p className="text-[#6b5c52] font-medium text-[16px] leading-relaxed mb-10 max-w-lg">
              Unforgettable celebrations, thoughtfully designed for you. Create premium private cinema experiences tailored perfectly to your special moments.
            </p>

            <div className="space-y-6 mb-10">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 shrink-0 rounded-full bg-[#f9f6f0] border border-[#f0e6dd] flex items-center justify-center shadow-sm">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1a1c21] mb-1">{benefit.title}</h3>
                    <p className="text-[#6b5c52] font-medium text-[14px] leading-relaxed max-w-md">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <button 
                onClick={() => navigate('/theaters')}
                className="px-8 py-4 bg-[#8c5211] hover:bg-[#6b3e0d] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(140,82,17,0.25)] hover:shadow-[0_8px_25px_rgba(140,82,17,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Book Your Experience
              </button>
            </div>
          </div>

          {/* Right Column: Gallery Carousel */}
          <div className="w-full lg:w-[50%] mt-12 lg:mt-0">
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-[#f9f6f0] border border-[#f0e6dd]">
              <AnimatePresence>
                {activeImages.length > 0 ? (
                  <motion.img
                    key={currentIndex}
                    src={getImageUrl(activeImages[currentIndex].image)}
                    alt={activeImages[currentIndex].title || "CS Cinemas Celebration"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f9f6f0]">
                    <div className="text-center p-8">
                      <Star className="w-12 h-12 text-[#d8a471] mx-auto mb-4 opacity-50" />
                      <p className="text-[#8c5211] font-bold font-heading text-xl">Celebrations at CS Cinemas</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* Pagination Dots */}
              {activeImages.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2 z-10">
                  {activeImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`transition-all duration-300 rounded-full shadow-sm ${
                        idx === currentIndex 
                          ? 'w-3.5 h-3.5 bg-[#8c5211]' 
                          : 'w-2 h-2 bg-white/80 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
