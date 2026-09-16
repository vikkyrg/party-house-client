import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { SEO } from '../components/common/SEO';

export function TheaterDetailsPage() {
  const { id } = useParams();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['theater', id],
    queryFn: () => theaterService.getTheaterById(id),
    enabled: !!id,
  });

  const theater = response?.data;

  if (isLoading) return <LoadingState message="Opening doors..." />;
  if (error) return <ErrorState error={error} />;
  if (!theater) return <div className="text-center py-20 text-white font-heading">Venue not found.</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEO title={`${theater.name} | CS Cinemas`} />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/theaters" className="inline-flex items-center gap-2 text-sm font-sans text-text-muted hover:text-primary transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> All Venues
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-8 space-y-12"
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-heading text-white mb-6">{theater.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm font-sans text-primary">
                <span className="flex items-center gap-2 uppercase tracking-widest font-bold">
                  <MapPin className="w-4 h-4" /> {theater.city?.name || 'Bengaluru'}
                </span>
                <span className="flex items-center gap-2 uppercase tracking-widest font-bold">
                  <Users className="w-4 h-4" /> Up to {theater.capacity} guests
                </span>
              </div>
            </div>

            <div className="aspect-video bg-surface overflow-hidden relative">
              <img 
                src={theater.images?.[0] || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'} 
                alt={theater.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-heading text-white mb-4">About this space</h2>
              <p className="text-text-muted font-sans leading-relaxed text-lg font-light">
                {theater.description || 'Experience cinematic perfection in our state-of-the-art private screening room. Designed for ultimate comfort and acoustic brilliance, this space is ideal for private premieres, romantic date nights, and exclusive gatherings.'}
              </p>
            </div>

            {theater.features && theater.features.length > 0 && (
              <div className="border-t border-white/5 pt-12">
                <h2 className="text-2xl font-heading text-white mb-8">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {theater.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-text-muted font-sans">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="sticky top-32 bg-surface p-8 md:p-10 border border-white/5 shadow-2xl"
            >
              <div className="mb-8 pb-8 border-b border-white/5">
                <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-text-muted mb-2">Reservation Base</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-heading text-white">₹{theater.pricePerHour}</span>
                  <span className="text-text-muted font-sans mb-1">/ hour</span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <Users className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-sans text-sm mb-1">Capacity</h4>
                    <p className="text-text-muted font-sans text-sm">Perfect for up to {theater.capacity} guests. Additional guests may incur extra charges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-sans text-sm mb-1">Customization</h4>
                    <p className="text-text-muted font-sans text-sm">Catering and decorations can be added during the booking process.</p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full h-14 text-base bg-primary text-background hover:bg-primary-hover shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                <Link to={`/booking?theater=${theater._id}`}>Reserve this space</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
