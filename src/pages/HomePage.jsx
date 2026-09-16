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
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0 bg-background">
          <AnimatePresence mode="wait">
            {banners.length > 0 ? (
              <motion.img 
                key={currentBannerIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.3, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                src={getImageUrl(banners[currentBannerIndex]?.image)} 
                alt="Private Theater" 
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
                alt="Private Theater" 
                className="w-full h-full object-cover opacity-30 absolute inset-0"
              />
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="container mx-auto px-6 z-10 text-center max-w-5xl pt-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-sans font-medium uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
          >
            <Sparkles className="w-4 h-4" /> The Royal Cinema Experience
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading text-white mb-6 leading-tight drop-shadow-2xl">
            Make the big screen <br/><span className="text-primary italic">yours.</span>
          </h1>
          
          <p className="text-lg md:text-xl font-sans text-text-muted mb-4 max-w-2xl mx-auto font-light">
            Host private premieres, intimate date nights, and grand celebrations in your own luxury theater.
          </p>
          
          <HeroBookingWidget />
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-32 border-t border-white/5 bg-surface relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <span className="text-xs font-sans font-bold tracking-widest uppercase text-primary mb-4 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-heading text-white">Three steps to your private premiere.</h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-12"
          >
            {[
              { icon: MapPin, title: "1. Select your venue", desc: "Choose from our collection of premium private theaters across the city." },
              { icon: Calendar, title: "2. Set the occasion", desc: "Whether it's a date night or a birthday, customize the experience to match." },
              { icon: Users, title: "3. Make it yours", desc: "Invite your guests, bring your content, and let our hospitality team handle the rest." }
            ].map((step, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="text-center group">
                <div className="w-20 h-20 mx-auto border border-primary/20 bg-primary/5 text-primary flex items-center justify-center rounded-full mb-8 group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-[0_0_15px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.4)]">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading text-white mb-4">{step.title}</h3>
                <p className="text-text-muted font-sans font-light leading-relaxed max-w-sm mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Occasions Teaser */}
      <section className="py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="flex flex-col md:flex-row justify-between items-end mb-16"
          >
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-heading text-white mb-6">Curated for<br/>every celebration.</h2>
            </div>
            <Link to="/events" className="text-sm font-sans font-medium text-primary hover:text-primary-hover transition-colors uppercase tracking-widest mt-6 md:mt-0 flex items-center gap-2 group">
              Explore All <span className="w-6 h-[1px] bg-primary group-hover:w-10 transition-all duration-300"></span>
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              { title: "Romantic Date Nights", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop" },
              { title: "Birthday Celebrations", img: "https://images.unsplash.com/photo-1530103862676-de8892b12a15?q=80&w=2070&auto=format&fit=crop" }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="group relative overflow-hidden bg-surface h-[500px] border border-white/5">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <h3 className="text-3xl font-heading text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
