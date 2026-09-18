import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { getImageUrl } from '../../utils/imageUtils';
import { CinemaSectionBackdrop } from './CinemaSectionBackdrop';

export function ServicesCarouselSection() {
  const { data: response } = useQuery({
    queryKey: ['services'],
    queryFn: contentService.getServices,
  });

  const allServices = response?.data || [];
  const services = allServices.filter(s => s.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

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

  const maxIndex = Math.max(0, services.length - cardsToShow);
  const isCarouselActive = services.length > cardsToShow;

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!isCarouselActive || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isCarouselActive, isHovered, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((index) => (index <= 0 ? maxIndex : index - 1));
  };

  const handleNext = () => {
    setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1));
  };

  if (services.length === 0) return null;

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-surface-container-low relative overflow-hidden">
      <CinemaSectionBackdrop variant="services" />
      <div className="container mx-auto max-w-[1320px] px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#a9651c]"></div>
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#a9651c]">
                OUR SERVICES
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-heading text-[#17171c] font-extrabold leading-[1.08] mb-5">
              Everything You Need <br className="hidden md:block"/>for the <span className="text-[#a9651c]">Celebration.</span>
            </h2>
            <p className="text-[#62554d] font-medium text-[16px] leading-relaxed">
              Personalize your private cinema experience with cakes, gifts, decorations and more.
            </p>
          </div>

          {isCarouselActive && (
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handlePrevious} aria-label="Previous service" className="w-11 h-11 rounded-full border border-[#dfc7b3] text-[#a9651c] flex items-center justify-center hover:bg-[#fffaf5] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNext} aria-label="Next service" className="w-11 h-11 rounded-full bg-[#a9651c] text-white flex items-center justify-center hover:bg-[#8e5217] transition-colors shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden w-full -mx-3 px-3" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="flex -mx-3 transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}>
            {services.map((item, idx) => (
                <div key={item._id || idx} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 h-[330px]">
                  <Link to="/services" className="block group h-full">
                    <div className="relative bg-[#fffaf5] rounded-[1.5rem] shadow-[0_4px_20px_rgba(75,43,20,0.06)] border border-[#ead9ca] flex flex-col overflow-hidden text-left h-full transition-transform group-hover:-translate-y-1 duration-300 group-hover:shadow-[0_10px_30px_rgba(169,101,28,0.14)]">
                      
                      {/* Image Section */}
                      <div className="relative h-[235px] w-full overflow-hidden shrink-0 bg-[#f4e7da]">
                        {getImageUrl(item.image) ? (
                          <img src={getImageUrl(item.image)} alt={item.title} className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#b28a68]">
                            <ImageIcon className="w-10 h-10" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="relative px-6 py-5 flex flex-col flex-grow bg-[#fffaf5] z-10 -mt-[1px] justify-center items-center">
                        <h3 className="text-[17px] font-bold text-[#17171c] text-center w-full truncate">
                          {item.title}
                        </h3>
                      </div>
                      
                    </div>
                      </Link>
                    </div>
                  ))}
              </div>
        </div>

            {isCarouselActive && (
              <div className="flex justify-center gap-1.5 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button key={index} onClick={() => setCurrentIndex(index)} aria-label={`Go to service slide ${index + 1}`} className={`h-2 rounded-full transition-all ${currentIndex === index ? 'w-6 bg-[#a9651c]' : 'w-2 bg-[#dfc7b3]'}`} />
                ))}
              </div>
            )}

      </div>
    </section>
  );
}
