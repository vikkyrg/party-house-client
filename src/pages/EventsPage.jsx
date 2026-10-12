import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { contentService } from '../services/contentService';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';

export function EventsPage() {
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['eventTypes'],
    queryFn: () => contentService.getEventTypes(),
  });

  // Natural display order: upcoming events first if eventDate is present, otherwise natural API order
  const sortedEvents = useMemo(() => {
    return [...occasions].sort((a, b) => {
      const dateA = a.eventDate || a.date;
      const dateB = b.eventDate || b.date;
      if (dateA && dateB) {
        return new Date(dateA) - new Date(dateB);
      }
      if (dateA) return -1;
      if (dateB) return 1;
      return 0;
    });
  }, [occasions]);

  if (isLoading) return <LoadingState message="Curating occasions..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <SEO title="Celebrations & Events | RIO PARTY HOUSE" />

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
          className="max-w-3xl mb-16"
        >
          <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 block">OCCASIONS & EXPERIENCES</span>
          <h1 className="text-[40px] md:text-[56px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-4">
            Every occasion deserves a <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">screen.</span>
          </h1>
          <p className="text-[14px] md:text-[15px] font-medium text-[#6b5c52] leading-[1.6]">
            From intimate date nights to grand birthday celebrations, our private theaters provide the perfect canvas for your most memorable moments.
          </p>
        </motion.div>

        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#ede3d8] p-16 text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="text-2xl font-heading text-[#1a1c21] mb-3">More experiences coming soon</h3>
            <p className="text-[#6b5c52] font-sans text-sm">We are currently curating new celebration packages for you.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
          >
            {sortedEvents.map((occasion) => {
              const eventTargetSlug = occasion.slug || occasion._id;
              const hasDate = Boolean(occasion.eventDate || occasion.date);
              const formattedDate = hasDate 
                ? new Date(occasion.eventDate || occasion.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : null;

              return (
                <motion.div 
                  key={occasion._id}
                  variants={itemVariants}
                  className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-[#ede3d8] shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Event Card Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FAF4ED] shrink-0">
                    {getImageUrl(occasion.image) ? (
                      <img 
                        src={getImageUrl(occasion.image)} 
                        alt={occasion.name} 
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                        <ImageIcon className="w-12 h-12 mb-2 text-slate-400" />
                        <span className="text-xs font-sans text-slate-400">RIO PARTY HOUSE</span>
                      </div>
                    )}
                    
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      {formattedDate ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-[#8c5211] shadow-sm">
                          {formattedDate}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#8c5211]/90 backdrop-blur-md text-white shadow-sm">
                          Celebration
                        </span>
                      )}

                      {occasion.duration && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white">
                          {occasion.duration} {occasion.duration === 1 ? 'Hour' : 'Hours'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Card Content */}
                  <div className="p-7 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-2xl font-heading font-black text-[#1a1c21] group-hover:text-[#8c5211] transition-colors leading-tight mb-3">
                        <Link to={`/events/${eventTargetSlug}`}>
                          {occasion.name}
                        </Link>
                      </h3>

                      <p className="text-[#6b5c52] font-sans text-sm leading-relaxed mb-6 line-clamp-3">
                        {occasion.description || 'Celebrate special moments with custom cinematic experiences, dedicated decor, and private comfort.'}
                      </p>
                    </div>

                    {/* Card Footer Details & Actions */}
                    <div className="pt-5 border-t border-[#f0e6dd] flex items-center justify-between gap-4 mt-auto">
                      <div>
                        {occasion.basePrice > 0 ? (
                          <div>
                            <span className="text-[11px] uppercase tracking-wider text-[#99887d] font-bold block">Starting at</span>
                            <span className="text-lg font-black text-[#1a1c21]">₹{occasion.basePrice}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#8c5211] uppercase tracking-wider">
                            Private Screening
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/events/${eventTargetSlug}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#6b5c52] hover:text-[#1a1c21] hover:bg-[#FAF4ED] transition-colors"
                        >
                          Details
                        </Link>
                        <Link 
                          to="/theaters" 
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#8c5211] text-white hover:bg-[#72410b] shadow-sm hover:shadow transition-all"
                        >
                          Book Now <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
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
