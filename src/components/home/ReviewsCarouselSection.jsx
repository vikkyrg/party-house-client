import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { getImageUrl } from '../../utils/imageUtils';
import { CinemaSectionBackdrop } from './CinemaSectionBackdrop';

export function ReviewsCarouselSection() {
  const { data: response } = useQuery({
    queryKey: ['reviews', 'public'],
    queryFn: contentService.getPublicReviews,
  });

  const reviews = (response?.data || []).filter((review) => review.isPublished === true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null); // { type, url }

  // Responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - cardsToShow);
  const isCarouselActive = reviews.length > cardsToShow;

  // Auto-play timer
  useEffect(() => {
    if (!isCarouselActive || isHovered || activeMedia) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isCarouselActive, maxIndex, isHovered, activeMedia]);

  const handleNext = () => {
    if (!isCarouselActive) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    if (!isCarouselActive) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 text-[#8c5211] mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm font-bold ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleMediaClick = (review) => {
    if (review.mediaType === 'link') {
      window.open(review.mediaUrl, '_blank', 'noopener,noreferrer');
    } else {
      setActiveMedia({ type: review.mediaType, url: review.mediaUrl });
    }
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-surface-container-low relative overflow-hidden">
      <CinemaSectionBackdrop variant="reviews" />
      <div className="container mx-auto max-w-[1320px] px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#a9651c]"></div>
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#a9651c]">
                CUSTOMER STORIES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-heading text-[#17171c] font-extrabold leading-[1.08] mb-5">
              Memories <span className="text-[#b94d5c]">They Loved.</span>
            </h2>
            <p className="text-[#62554d] font-medium text-[16px] leading-relaxed">
              Real experiences from guests who celebrated their special moments with RIO PARTY HOUSE.
            </p>
          </div>
          
          {/* Navigation Controls */}
          {isCarouselActive && (
            <div className="flex flex-col items-end gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full border border-[#dfc7b3] flex items-center justify-center hover:bg-[#fffaf5] text-[#a9651c] transition-colors"
                  aria-label="Previous Review"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-[#a9651c] hover:bg-[#8e5217] flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Next Review"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
              
              {/* Pagination Dots */}
              <div className="flex gap-1.5 justify-center pr-2">
                {[...Array(maxIndex + 1)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i ? 'w-6 bg-[#a9651c]' : 'w-2 bg-[#dfc7b3] hover:bg-[#c7a789]'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carousel Window */}
        <div 
          className="overflow-hidden w-full relative -mx-4 px-4 pb-8 pt-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
          >
            {reviews.map((review, idx) => (
              <div key={review._id || idx} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-4 h-[440px]">
                <div className="bg-[#fffaf5] rounded-[1.5rem] shadow-[0_4px_20px_rgba(75,43,20,0.06)] border border-[#ead9ca] flex flex-col overflow-hidden text-left h-full transition-shadow hover:shadow-[0_10px_30px_rgba(169,101,28,0.14)]">
                  
                  {/* Media Section */}
                  {review.mediaType !== 'none' && (review.mediaUrl || review.images?.[0]?.url) && (
                    <div 
                      className="relative h-[200px] w-full overflow-hidden shrink-0 bg-[#0F1014] cursor-pointer group"
                      onClick={() => handleMediaClick(review)}
                    >
                      {review.mediaType === 'image' ? (
                        <img 
                          src={getImageUrl(review.mediaUrl || review.images?.[0]?.url)} 
                          alt="Customer Review" 
                          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#302522] group-hover:bg-[#49362f] transition-colors">
                          {review.mediaType === 'video' ? (
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                              <ExternalLink className="w-8 h-8" />
                              <span className="text-sm font-medium">Watch Review</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="px-8 pt-8 pb-8 flex flex-col flex-grow bg-[#fffaf5] relative">
                    {renderStars(review.rating)}
                    
                    <p className="text-[#17171c] font-medium text-[15px] leading-relaxed mb-6 line-clamp-5 italic">
                      "{review.comment}"
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-[#eadfd5]">
                      <h4 className="font-bold text-[#17171c] text-[15px]">
                        {review.customerName || review.user?.name || 'Happy Customer'}
                      </h4>
                      {review.theater && (
                        <p className="text-[#a9651c] text-[13px] font-medium mt-1 uppercase tracking-wider">
                          {review.theater.name || review.theater}
                        </p>
                      )}
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-12"
            onClick={() => setActiveMedia(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
              onClick={() => setActiveMedia(null)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {activeMedia.type === 'image' && (
                <img 
                  src={getImageUrl(activeMedia.url)} 
                  alt="Review Full" 
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              )}
              {activeMedia.type === 'video' && (
                <video 
                  src={getImageUrl(activeMedia.url)} 
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] rounded-lg bg-black"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
