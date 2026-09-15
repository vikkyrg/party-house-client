import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useState } from 'react';

export function ReviewPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit review to API
    navigate(`/account/bookings/${bookingId}`);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass-card p-8 rounded-2xl"
      >
        <h1 className="text-2xl font-bold mb-2 text-white">Rate your experience</h1>
        <p className="text-text-muted mb-8">Booking #{bookingId}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={`w-10 h-10 ${index <= (hover || rating) ? "text-primary" : "text-white/20"} transition-colors`}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-text-muted">Your Review</label>
            <textarea 
              className="w-full h-32 bg-surface/50 border border-surface-hover rounded-xl p-4 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
              placeholder="Tell us about your celebration..."
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 px-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!rating} className="flex-1 py-3 px-4 rounded-xl font-bold bg-primary text-background hover:bg-primary-hover transition-colors disabled:opacity-50">
              Submit Review
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
