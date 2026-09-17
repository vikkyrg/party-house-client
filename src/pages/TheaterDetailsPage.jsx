import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { theaterService } from '../services/theaterService';
import { getImageUrl } from '../utils/imageUtils';
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
    <div className="min-h-screen bg-surface pt-32 pb-24">
      <SEO title={`${theater.name} | CS Cinemas`} />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/theaters" className="inline-flex items-center gap-2 text-[11px] font-bold font-sans text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest bg-surface-container-low px-4 py-1.5 rounded-full">
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
              <h1 className="text-4xl md:text-5xl font-heading text-on-surface font-extrabold mb-4">{theater.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm font-sans text-primary">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/80 text-on-primary-fixed text-[11px] uppercase tracking-widest font-bold">
                  <MapPin className="w-3.5 h-3.5" /> {theater.city?.name || 'Bengaluru'}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface text-[11px] uppercase tracking-widest font-bold">
                  <Users className="w-3.5 h-3.5 text-secondary" /> Up to {theater.capacity} guests
                </span>
              </div>
            </div>

            <div className="aspect-video bg-surface-container overflow-hidden rounded-2xl relative shadow-md">
              <img 
                src={theater.images?.[0] ? getImageUrl(theater.images[0]) : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070'} 
                alt={theater.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-heading text-on-surface font-bold mb-4">About this space</h2>
              <p className="text-on-surface-variant font-sans leading-relaxed text-base">
                {theater.description || 'Experience cinematic perfection in our state-of-the-art private screening room. Designed for ultimate comfort and acoustic brilliance, this space is ideal for private premieres, romantic date nights, and exclusive gatherings.'}
              </p>
            </div>

            {theater.features && theater.features.length > 0 && (
              <div className="border-t border-surface-container pt-8">
                <h2 className="text-2xl font-heading text-on-surface font-bold mb-6">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {theater.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-on-surface-variant font-medium font-sans">
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
              className="sticky top-32 bg-surface-container-lowest p-8 md:p-8 rounded-2xl border border-surface-container-low shadow-[0_12px_36px_rgba(38,28,20,0.06),0_4px_12px_rgba(217,119,6,0.08)]"
            >
              <div className="mb-6 pb-6 border-b border-surface-container">
                <p className="font-label-sm text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Reservation Base</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-heading text-primary font-extrabold">₹{theater.pricePerHour}</span>
                  <span className="text-on-surface-variant font-sans mb-1 font-medium">/ 3 Hours</span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0 text-secondary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-on-surface font-sans text-sm font-bold mb-1">Capacity</h4>
                    <p className="text-on-surface-variant font-sans text-sm">Perfect for up to {theater.capacity} guests. Additional guests may incur extra charges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-on-surface font-sans text-sm font-bold mb-1">Customization</h4>
                    <p className="text-on-surface-variant font-sans text-sm">Catering and decorations can be added during the booking process.</p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to={`/booking?theater=${theater._id}`}>Reserve this space</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
