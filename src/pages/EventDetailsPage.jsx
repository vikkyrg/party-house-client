import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export function EventDetailsPage() {
  const { eventSlug } = useParams();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-4 capitalize">{eventSlug}</h1>
        <p className="text-text-muted mb-8">Details and suitable theaters for this event type will be listed here.</p>
        
        <div className="glass-card p-8 rounded-2xl">
          <p className="text-center text-text-muted">Coming soon...</p>
        </div>
      </motion.div>
    </div>
  );
}
