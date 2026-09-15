import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';

export function InvoicePage() {
  const { bookingId } = useParams();

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Link to={`/account/bookings/${bookingId}`} className="inline-flex items-center text-primary mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Booking
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 rounded-2xl bg-surface"
        >
          <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">INVOICE</h1>
              <p className="text-text-muted">#{bookingId}</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-primary text-background font-bold rounded-lg hover:bg-primary-hover transition-colors">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </button>
          </div>
          
          <div className="text-center py-12 text-text-muted">
            Invoice generation is pending API integration.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
