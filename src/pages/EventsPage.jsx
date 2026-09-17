import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { contentService } from '../services/contentService';
import { getImageUrl } from '../utils/imageUtils';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';

export function EventsPage() {
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => contentService.getEventTypes(),
  });

  const occasions = response?.data || [];

  if (isLoading) return <LoadingState message="Curating occasions..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <SEO title="Celebrations & Events | CS Cinemas" />

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

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 relative z-10 max-w-[1920px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mb-20"
        >
          <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 block">OCCASIONS</span>
          <h1 className="text-[40px] md:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
            Every occasion deserves a <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">screen.</span>
          </h1>
          <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] leading-[1.6]">
            From intimate date nights to grand birthday celebrations, our private theaters provide the perfect canvas for your most memorable moments.
          </p>
        </motion.div>

        {occasions.length === 0 ? (
          <div className="bg-surface border border-white/5 p-16 text-center">
            <h3 className="text-2xl font-heading text-[#1a1c21] mb-4">More experiences coming soon</h3>
            <p className="text-text-muted font-sans">We are currently curating new celebration packages.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px]"
          >
            {occasions.map((occasion, index) => {
              // Algorithmic grid placement
              let colSpan = 'md:col-span-4';
              let rowSpan = 'row-span-1';
              
              if (index % 5 === 0) {
                // Large item
                colSpan = 'md:col-span-8';
                rowSpan = 'row-span-2';
              } else if (index % 5 === 1) {
                // Tall item
                colSpan = 'md:col-span-4';
                rowSpan = 'row-span-2';
              } else if (index % 5 === 2) {
                // Wide item
                colSpan = 'md:col-span-8';
              }

              return (
                <motion.div 
                  key={occasion._id}
                  variants={itemVariants}
                  className={`${colSpan} ${rowSpan} group relative overflow-hidden bg-surface`}
                >
                  {getImageUrl(occasion.image) ? (
                    <img 
                      src={getImageUrl(occasion.image)} 
                      alt={occasion.name} 
                      className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-[1.5s] ease-out bg-surface-strong">
                      <ImageIcon className="w-16 h-16 mb-4" />
                    </div>
                  )}
                  
                  {/* Bottom shadow overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors duration-700" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col justify-end h-full">
                    <h3 className="text-2xl md:text-3xl font-heading text-white mb-3 group-hover:text-primary transition-colors duration-500">{occasion.name}</h3>
                    
                    {occasion.description && (
                      <p className="text-white/80 font-sans text-sm max-w-sm hidden md:block opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                        {occasion.description}
                      </p>
                    )}
                    
                    <Link 
                      to="/theaters" 
                      className="mt-6 inline-flex items-center gap-2 text-sm font-sans font-bold text-white hover:text-white/80 transition-all w-fit opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-500"
                    >
                      Plan this event <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Customization section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32 pt-20 border-t border-white/5"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] md:text-[40px] font-heading text-[#1a1c21] font-bold mb-4">Make it entirely yours.</h2>
              <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] leading-[1.6] mb-8">
                Our in-house hospitality team provides end-to-end event customization. Add gourmet catering, professional photography, bespoke floral arrangements, and personalized on-screen messaging.
              </p>
              <Link to="/theaters" className="inline-flex items-center justify-center px-8 h-12 bg-[#9e6223] text-white font-sans font-medium hover:bg-[#7a4b1b] transition-colors">
                Book a Screening
              </Link>
            </div>
            <div className="bg-white p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
              <p className="font-medium text-[16px] text-[#1a1c21] italic mb-6">"The perfect blend of luxury hospitality and cinematic magic."</p>
              <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211]">— LIFESTYLE MAGAZINE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
