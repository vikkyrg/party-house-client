import { Link } from 'react-router-dom';
import { Play, Sparkles, MapPin, Calendar, Users, Star } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { contentService } from '../services/contentService';
import { getImageUrl } from '../utils/imageUtils';
import { HeroBookingWidget } from '../components/home/HeroBookingWidget';

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
    queryKey: ['banners', 'home'],
    queryFn: () => contentService.getBanners('home'),
  });
  const banners = bannersResponse?.data || [];
  
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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-12 bg-surface-container-low">
        
        {/* Right side banner image */}
        <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full z-0 pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-surface-container-low to-transparent z-10 hidden lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-surface-container-low to-transparent z-10 lg:hidden" />
          <AnimatePresence mode="wait">
            {banners.length > 0 ? (
              <motion.img 
                key={currentBannerIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                src={getImageUrl(banners[currentBannerIndex]?.image)} 
                alt="Private Theater" 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
                alt="Private Theater" 
                className="w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6 z-10 pt-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="lg:col-span-7 xl:col-span-6 text-left"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-8 bg-primary"></div>
                <span className="font-label-sm text-[11px] uppercase tracking-widest font-bold text-primary">BENGALURU'S #1 BOUTIQUE MINI THEATERS</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-heading text-on-surface mb-6 leading-[1.1] tracking-tight font-black">
                Big Moments <br/>
                Deserve a <br/>
                <span className="bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent">Private Screen</span>
              </h1>
              
              <p className="text-base md:text-lg font-sans text-on-surface-variant mb-10 max-w-xl font-medium leading-relaxed">
                Experience 4K Dolby Atmos mini-theaters for romantic dates, epic birthday bashes, binge nights, and live gaming tournaments. 100% private to you and your crew.
              </p>
              
              <HeroBookingWidget />
            </motion.div>
          </div>
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
            <h2 className="text-4xl md:text-5xl font-heading text-on-surface font-extrabold mb-4">
              Three steps to your <span className="bg-gradient-to-r from-primary to-[#c44569] bg-clip-text text-transparent">private premiere.</span>
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
                  linkText: "EXPLORE VENUES"
                },
                { 
                  num: "02", 
                  image: "/icon_occasion_3d.jpg", 
                  title: "Set the occasion", 
                  desc: "Whether it's a date night or a birthday, customize the experience to match.",
                  linkText: "PLAN YOUR EVENT"
                },
                { 
                  num: "03", 
                  image: "/icon_makeityours_3d.jpg", 
                  title: "Make it yours", 
                  desc: "Invite your guests, bring your content, and let our hospitality team handle the rest.",
                  linkText: "CREATE MEMORIES"
                }
              ].map((step, idx) => (
                <motion.div key={idx} variants={fadeUpVariant} className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-lg relative group border border-surface-container hover:shadow-xl transition-shadow text-center flex flex-col h-full">
                  {/* Badge */}
                  <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-[#8c5211] text-white font-bold flex items-center justify-center text-sm shadow-md z-10">
                    {step.num}
                  </div>
                  
                  {/* Image Circle */}
                  <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-8 mt-4 group-hover:scale-105 transition-transform duration-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] relative bg-[#F9F6F0]">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  
                  <h3 className="text-2xl font-heading text-on-surface font-black mb-4">{step.title}</h3>
                  <p className="text-on-surface-variant font-sans font-medium leading-relaxed mb-10 flex-grow text-[15px]">{step.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-bold tracking-widest text-[#8c5211] uppercase">{step.linkText}</span>
                    <div className="w-8 h-8 rounded-full bg-[#EADDD0] flex items-center justify-center group-hover:bg-[#8c5211] group-hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Occasions Teaser */}
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
            
            <div className="flex items-center gap-4">
              <Link to="/events" className="px-6 py-3 rounded-full border border-[#8c5211] text-[#8c5211] font-bold text-xs uppercase tracking-widest hover:bg-[#8c5211] hover:text-white transition-colors flex items-center gap-2">
                EXPLORE ALL <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-[#8c5211] hover:bg-[#8c5211] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-[#8c5211] flex items-center justify-center text-white hover:bg-[#6b3e0d] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {[
              { 
                icon: <svg className="w-5 h-5 text-[#8c5211]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                title: "Romantic Date Nights", 
                desc: "A cozy space for two, with the perfect ambience for love.",
                img: "/event_romantic.jpg" 
              },
              { 
                icon: <svg className="w-5 h-5 text-[#8c5211]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>,
                title: "Birthday Celebrations", 
                desc: "Make birthdays extra special with a private big-screen experience.",
                img: "/event_birthday.jpg" 
              },
              { 
                icon: <svg className="w-5 h-5 text-[#8c5211]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                title: "Friends & Group Hangouts", 
                desc: "Bigger fun, better together. Enjoy movies, games and more.",
                img: "/event_friends.jpg" 
              },
              { 
                icon: <svg className="w-5 h-5 text-[#8c5211]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                title: "Corporate & Special Events", 
                desc: "Host product launches, team events or private screenings in style.",
                img: "/event_corporate.jpg" 
              }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="group relative bg-[#0B0C10] rounded-[1.5rem] shadow-lg border border-white/5 flex flex-col overflow-hidden text-left h-full transition-transform hover:-translate-y-1 duration-300">
                
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/40 to-transparent" />
                </div>
                
                {/* Content Section */}
                <div className="relative px-6 pb-6 pt-4 flex flex-col flex-grow">
                  {/* Floating Icon */}
                  <div className="absolute -top-10 left-6 w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-md border border-[#F9F6F0]">
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-heading text-white font-bold mb-2 mt-4 leading-tight">{item.title}</h3>
                  <p className="text-gray-400 font-sans text-[13px] leading-relaxed mb-6 flex-grow">{item.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-bold tracking-widest text-[#d8a471] uppercase">EXPLORE <span className="ml-1">→</span></span>
                    <div className="w-8 h-8 rounded-full bg-[#1F222B] flex items-center justify-center group-hover:bg-[#8c5211] text-[#d8a471] group-hover:text-white transition-colors duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
