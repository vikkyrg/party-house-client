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
    <div className="min-h-screen bg-background pt-32 pb-24 overflow-hidden">
      <SEO title="Celebrations & Events | CS Cinemas" />

      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mb-20"
        >
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-primary mb-4 block">Occasions</span>
          <h1 className="text-4xl md:text-6xl font-heading text-white mb-6">Every occasion deserves a screen.</h1>
          <p className="text-lg font-sans text-text-muted leading-relaxed">
            From intimate date nights to grand birthday celebrations, our private theaters provide the perfect canvas for your most memorable moments.
          </p>
        </motion.div>

        {occasions.length === 0 ? (
          <div className="bg-surface border border-white/5 p-16 text-center">
            <h3 className="text-2xl font-heading text-white mb-4">More experiences coming soon</h3>
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
                      className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-[1.5s] ease-out bg-surface-strong">
                      <ImageIcon className="w-16 h-16 mb-4" />
                    </div>
                  )}
                  
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent group-hover:from-background/80 transition-colors duration-700" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col justify-end h-full">
                    <h3 className="text-2xl md:text-3xl font-heading text-white mb-3 group-hover:text-primary transition-colors duration-500">{occasion.name}</h3>
                    
                    {occasion.description && (
                      <p className="text-text-muted font-sans text-sm max-w-sm hidden md:block opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        {occasion.description}
                      </p>
                    )}
                    
                    <Link 
                      to="/theaters" 
                      className="mt-6 inline-flex items-center gap-2 text-sm font-sans font-medium text-white hover:text-primary transition-all w-fit opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-500"
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
              <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">Make it entirely yours.</h2>
              <p className="text-text-muted font-sans leading-relaxed mb-8">
                Our in-house hospitality team provides end-to-end event customization. Add gourmet catering, professional photography, bespoke floral arrangements, and personalized on-screen messaging.
              </p>
              <Link to="/theaters" className="inline-flex items-center justify-center px-8 h-12 bg-primary text-background font-sans font-medium hover:bg-primary-hover transition-colors shadow-[0_4px_20px_rgba(229,192,123,0.3)] hover:shadow-[0_8px_30px_rgba(229,192,123,0.5)]">
                Book a Screening
              </Link>
            </div>
            <div className="bg-surface p-12 text-center border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <p className="font-heading text-xl text-white italic mb-4 relative z-10">"The perfect blend of luxury hospitality and cinematic magic."</p>
              <span className="text-xs font-sans text-primary uppercase tracking-widest relative z-10">— Lifestyle Magazine</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
