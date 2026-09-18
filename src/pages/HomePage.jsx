import { Link } from 'react-router-dom';
import { Play, Sparkles, MapPin, Calendar, Users, Star, Film, Lock, Heart } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '../services/contentService';
import { getImageUrl } from '../utils/imageUtils';
import { HeroBookingWidget } from '../components/home/HeroBookingWidget';
import { WhyChooseUsSection } from '../components/home/WhyChooseUsSection';
import { ServicesCarouselSection } from '../components/home/ServicesCarouselSection';
import { ReviewsCarouselSection } from '../components/home/ReviewsCarouselSection';

export function HomePage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const { data: bannersResponse } = useQuery({
    queryKey: ['banners', 'homepage-hero'],
    queryFn: () => contentService.getBanners('homepage-hero'),
  });
  const banners = bannersResponse?.data || [];

  const { data: eventTypesResponse } = useQuery({
    queryKey: ['event-types'],
    queryFn: () => contentService.getEventTypes(),
  });
  const eventTypes = eventTypesResponse?.data || [];
  
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 overflow-hidden">
      <SEO title="CS Cinemas | Premium Private Screenings" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex items-center justify-center">
        
        {/* Full-width background image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <AnimatePresence mode="wait">
            {banners.length > 0 ? (
              <motion.img 
                key={currentBannerIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                src={getImageUrl(banners[currentBannerIndex]?.image)} 
                alt="Private Theater" 
                className="hero-background-image w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
                alt="Private Theater" 
                className="hero-background-image w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-4 z-20 flex flex-col items-center justify-center relative">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-center mb-8 w-full px-2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-heading text-white font-black leading-[1.15] mb-4 tracking-tight">
              India's Best Private Theatre Venue <br className="hidden md:block" />
              for <span className="text-[#f2b7a5]">Celebrations</span>
            </h1>
            <p className="text-[16px] md:text-xl text-white/90 font-sans font-medium">
              Book Your Perfect Celebration: Birthdays, Anniversaries, Date Nights & More!
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-[800px]"
          >
            <HeroBookingWidget />
          </motion.div>

          {/* Features Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/90 font-bold text-[11px] md:text-[13px] uppercase tracking-wider"
          >
            <span className="flex items-center gap-2"><Film className="w-4 h-4 md:w-5 md:h-5"/> 4K Dolby Atmos</span>
            <span className="hidden md:block w-px h-5 bg-white/30"></span>
            <span className="flex items-center gap-2"><Lock className="w-4 h-4 md:w-5 md:h-5"/> 100% Private</span>
            <span className="hidden md:block w-px h-5 bg-white/30"></span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 md:w-5 md:h-5"/> Custom Setup</span>
            <span className="hidden md:block w-px h-5 bg-white/30"></span>
            <span className="flex items-center gap-2"><Heart className="w-4 h-4 md:w-5 md:h-5"/> Memories Forever</span>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        
        {/* Background Film Strip Design */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 pointer-events-none hidden xl:block -rotate-12 opacity-[0.05] z-0">
          <svg width="300" height="800" viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 0V400 M85 0V400" stroke="#8c5211" strokeWidth="4" />
            <path d="M5 0V400 M95 0V400" stroke="#8c5211" strokeWidth="4" strokeDasharray="8 8" />
            <rect x="25" y="20" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="80" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="140" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="200" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="260" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
            <rect x="25" y="320" width="50" height="40" stroke="#8c5211" strokeWidth="2" />
          </svg>
        </div>

        {/* Background Cursive Text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden xl:block translate-x-8 z-0">
          <div className="font-[cursive] text-[7rem] leading-[0.85] text-[#8c5211] opacity-[0.25] -rotate-12 transform scale-y-110">
            More <br/> Than <br/> Movies
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-primary"></div>
              <span className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-primary">THE PROCESS</span>
              <div className="h-[1px] w-12 bg-primary"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading text-[#1a1c21] font-extrabold mb-4">
              Three steps to your <span className="text-[#B04A55]">private premiere.</span>
            </h2>
            <p className="text-on-surface-variant font-medium text-lg">
              From choosing your space to creating unforgettable memories — it's simple, seamless and made for you.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Dotted connecting line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-primary/30 -translate-y-1/2 hidden md:block z-0" />
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10"
            >
              {[
                { 
                  num: "01", 
                  image: "/icon_venue_3d.jpg", 
                  title: "Select your venue", 
                  desc: "Choose from our collection of premium private theaters across the city.",
                  linkText: "EXPLORE VENUES",
                  link: "/theaters"
                },
                { 
                  num: "02", 
                  image: "/icon_occasion_3d.jpg", 
                  title: "Set the occasion", 
                  desc: "Whether it's a date night or a birthday, customize the experience to match.",
                  linkText: "PLAN YOUR EVENT",
                  link: "/theaters"
                },
                { 
                  num: "03", 
                  image: "/icon_makeityours_3d.jpg", 
                  title: "Make it yours", 
                  desc: "Invite your guests, bring your content, and let our hospitality team handle the rest.",
                  linkText: "CREATE MEMORIES",
                  link: "/theaters"
                }
              ].map((step, idx) => (
                <Link to={step.link} key={idx} className="block group">
                  <motion.div variants={fadeUpVariant} className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm relative border border-[#f0e6dd] group-hover:shadow-xl transition-shadow text-center flex flex-col h-full">
                    {/* Badge */}
                    <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#8c5211] text-white font-bold flex items-center justify-center text-sm shadow-md z-10">
                      {step.num}
                    </div>
                    
                    {/* Image Circle */}
                    <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-8 mt-4 group-hover:scale-105 transition-transform duration-500 relative bg-[#F9F6F0]">
                      <img src={step.image} alt={step.title} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    <h3 className="text-2xl font-heading text-[#1a1c21] font-black mb-4">{step.title}</h3>
                    <p className="text-[#6b5c52] font-sans font-medium leading-relaxed mb-10 flex-grow text-[15px]">{step.desc}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[11px] font-bold tracking-widest text-[#8c5211] uppercase">{step.linkText}</span>
                      <div className="w-8 h-8 rounded-full bg-[#EADDD0] flex items-center justify-center group-hover:bg-[#8c5211] transition-colors duration-300">
                        <svg className="w-4 h-4 text-[#8c5211] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Occasions Teaser */}
      {eventTypes.length > 0 && (
      <section className="py-24 bg-surface-container-low relative">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-[2px] w-8 bg-[#c44569]"></div>
                <span className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-[#c44569]">UNFORGETTABLE MEMORIES</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading text-on-surface font-extrabold leading-tight">
                Curated for <br/>
                every <span className="bg-gradient-to-r from-primary to-[#c44569] bg-clip-text text-transparent">celebration.</span>
              </h2>
            </div>
            
            <div className="max-w-md">
              <p className="text-on-surface-variant font-medium mb-2">
                From romantic date nights to birthdays and special events, our private theaters are designed for every moment that matters.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="overflow-hidden w-full relative -mx-4 px-4 pb-8 pt-4 md:-mx-12 md:px-12">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              className="flex w-max gap-6"
            >
              {[...Array(2)].flatMap(() => eventTypes).map((item, idx) => (
                <div key={idx} className="w-[300px] md:w-[320px] shrink-0 h-[440px]">
                  <Link to="/theaters" className="block group h-full">
                    <div className="relative bg-[#0F1014] rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-[#2a2c35] flex flex-col overflow-hidden text-left h-full transition-transform group-hover:-translate-y-2 duration-300 transform-gpu">
                  
                  {/* Image Section */}
                  <div className="relative h-[220px] w-full overflow-hidden shrink-0 bg-[#0F1014]">
                    <img src={getImageUrl(item.image)} alt={item.name} className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1014] via-[#0F1014]/40 to-transparent" />
                  </div>
                  
                  {/* Content Section */}
                  <div className="relative px-6 pb-6 pt-2 flex flex-col flex-grow bg-[#0F1014] z-10 -mt-[1px]">
                    {/* Floating Icon */}
                    <div className="absolute -top-12 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                      <Star className="w-5 h-5 text-[#8c5211]" />
                    </div>
                    
                    <h3 className="text-xl font-heading text-white font-bold mb-3 mt-4 leading-tight">{item.name}</h3>
                    <p className="text-gray-400 font-sans text-[13px] leading-relaxed mb-6 flex-grow line-clamp-3">{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-bold tracking-widest text-[#d8a471] uppercase">EXPLORE <span className="ml-1">→</span></span>
                      <div className="w-8 h-8 rounded-full bg-[#1a1c21] flex items-center justify-center group-hover:bg-[#2a2c35] text-[#d8a471] transition-colors duration-300">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </div>
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      )}
      {/* Why Choose CS Cinemas Section */}
      <WhyChooseUsSection />

      {/* Services Carousel Section */}
      <ServicesCarouselSection />

      {/* Reviews Carousel Section */}
      <ReviewsCarouselSection />

    </div>
  );
}
