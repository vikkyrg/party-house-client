import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Sparkles, 
  Film, 
  ShieldCheck, 
  Users, 
  Music, 
  HeartHandshake,
  Image as ImageIcon
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEO } from '../components/common/SEO';

export function EventDetailsPage() {
  const { eventSlug } = useParams();

  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: ['eventType', eventSlug],
    queryFn: () => contentService.getEventTypeBySlugOrId(eventSlug),
    enabled: Boolean(eventSlug),
  });

  const event = response?.data;

  if (isLoading) return <LoadingState message="Loading celebration details..." />;
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl border border-[#ede3d8] text-center max-w-lg shadow-sm">
          <h2 className="text-2xl font-heading font-black text-[#1a1c21] mb-2">Event Not Found</h2>
          <p className="text-[#6b5c52] font-sans text-sm mb-6">The celebration package you're looking for doesn't exist or is currently unavailable.</p>
          <Link 
            to="/events" 
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8c5211] text-white font-sans text-sm font-bold hover:bg-[#72410b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Occasions
          </Link>
        </div>
      </div>
    );
  }

  const hasDate = Boolean(event.eventDate || event.date);
  const formattedDate = hasDate
    ? new Date(event.eventDate || event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const inclusions = [
    {
      icon: Film,
      title: 'Private 4K Screening',
      desc: 'Exclusive private auditorium with Dolby Atmos surround sound for you and your guests.'
    },
    {
      icon: Sparkles,
      title: 'Celebration Decor',
      desc: 'Tasteful ambient theme lighting, red carpet welcome, and tailored occasion setup.'
    },
    {
      icon: Music,
      title: 'Personalized Media',
      desc: 'Custom photo slideshows, video messages, and music on the cinematic big screen.'
    },
    {
      icon: HeartHandshake,
      title: 'Hospitality Concierge',
      desc: 'Dedicated on-site host to handle gourmet dining, cake reveal, and guest comfort.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-28 pb-24 relative overflow-hidden font-sans">
      <SEO 
        title={`${event.metaTitle || event.name} | RIO PARTY HOUSE`}
        description={event.metaDescription || event.description || `Celebrate ${event.name} in a luxury private theater.`}
      />

      {/* Decorative film background SVGs */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[500px] h-[500px] z-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="500" fill="none" stroke="#eaddd0" strokeWidth="40" />
            <circle cx="0" cy="0" r="485" fill="none" stroke="#FAF4ED" strokeWidth="10" strokeDasharray="12 12" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 relative z-10 max-w-[1440px]">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#786960] mb-8 pt-4">
          <Link to="/" className="hover:text-[#1a1c21] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-[#1a1c21] transition-colors">Occasions</Link>
          <span>/</span>
          <span className="text-[#8c5211] font-bold">{event.name}</span>
        </div>

        {/* Back Link */}
        <Link 
          to="/events" 
          className="inline-flex items-center gap-2 text-sm font-sans font-bold text-[#8c5211] hover:text-[#72410b] mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all occasions
        </Link>

        {/* Main Event Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* Left Column: Event Visual & Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#ede3d8] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              {/* Event Hero Image */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-[#FAF4ED] overflow-hidden">
                {getImageUrl(event.image) ? (
                  <img 
                    src={getImageUrl(event.image)} 
                    alt={event.name} 
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon className="w-16 h-16 mb-2 text-slate-400" />
                    <span className="text-sm font-sans text-slate-400">RIO PARTY HOUSE</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Image overlay badges */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-white">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#8c5211]/90 backdrop-blur-md">
                    Signature Experience
                  </span>

                  {event.duration && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5" />
                      {event.duration} {event.duration === 1 ? 'Hour' : 'Hours'}
                    </span>
                  )}
                </div>
              </div>

              {/* Event Body */}
              <div className="p-8 sm:p-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#8c5211] mb-2 block">
                  CELEBRATION PACKAGE
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#1a1c21] leading-tight mb-6">
                  {event.name}
                </h1>

                {formattedDate && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF4ED] border border-[#eaddd0] text-sm font-medium text-[#8c5211] mb-6">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                  </div>
                )}

                <div className="prose prose-slate max-w-none text-[#6b5c52] font-sans text-base leading-relaxed space-y-4">
                  <p className="whitespace-pre-line text-[15px] md:text-base">
                    {event.description || 'Celebrate your special day with an exclusive private screening, premium entertainment, and unforgettable ambiance in our luxury private theaters.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Experience Inclusions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#ede3d8] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <h2 className="text-2xl font-heading font-black text-[#1a1c21] mb-2">
                What's Included in This Experience
              </h2>
              <p className="text-[#6b5c52] font-sans text-sm mb-8">
                Every event booking at RIO PARTY HOUSE includes high-end amenities designed for a seamless celebration.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {inclusions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-[#FCF5EB]/60 border border-[#f0e6dd]">
                      <div className="w-10 h-10 rounded-xl bg-[#8c5211]/10 flex items-center justify-center shrink-0 text-[#8c5211]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-[#1a1c21] mb-1">{item.title}</h4>
                        <p className="text-xs text-[#6b5c52] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Booking Action Card */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 border border-[#ede3d8] shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-6"
            >
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#8c5211] block mb-1">
                  READY TO CELEBRATE?
                </span>
                <h3 className="text-2xl font-heading font-black text-[#1a1c21]">
                  Book This Experience
                </h3>
              </div>

              {event.basePrice > 0 ? (
                <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#eaddd0]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#99887d] block mb-0.5">Starting Package</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-[#1a1c21]">₹{event.basePrice}</span>
                    <span className="text-xs text-[#786960] font-sans">/ celebration</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-[#eaddd0]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8c5211] block mb-0.5">Pricing</span>
                  <span className="text-base font-bold text-[#1a1c21]">Customized based on venue & guests</span>
                </div>
              )}

              <div className="space-y-3 text-xs font-sans text-[#6b5c52]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Private Theater reserved just for your group</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#8c5211] shrink-0" />
                  <span>Accommodates couples, families, and party groups</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#8c5211] shrink-0" />
                  <span>Flexible screening slots available daily</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f0e6dd] space-y-3">
                <Link 
                  to="/theaters"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#8c5211] text-white font-sans text-sm font-bold hover:bg-[#72410b] shadow-md hover:shadow-lg transition-all"
                >
                  Select Theater & Date <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link 
                  to="/contact"
                  className="w-full flex items-center justify-center py-3 px-6 rounded-2xl border border-[#ede3d8] text-[#6b5c52] hover:text-[#1a1c21] hover:bg-[#FAF4ED] font-sans text-xs font-bold transition-colors"
                >
                  Contact Event Specialist
                </Link>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#99887d] font-sans">
                  Need custom cakes, decor upgrades, or catering? Options available at checkout.
                </p>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
