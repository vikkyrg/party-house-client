import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function BookingSuccessPage() {
  const { bookingId } = useParams();

  return (
    <div className="min-h-screen pt-28 pb-20 bg-background flex items-center justify-center relative overflow-hidden">
      <SEO title="Booking Confirmed | CS Cinemas" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="container mx-auto px-4 max-w-lg relative z-10"
      >
        <div className="glass-card p-10 md:p-14 rounded-3xl border border-white/10 text-center shadow-2xl flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-4">Booking Confirmed!</h1>
          <p className="text-text-muted text-lg mb-8">Thank you for choosing CS Cinemas. We're excited to host your premium celebration.</p>
          
          <div className="bg-black/30 w-full p-4 rounded-xl border border-white/5 mb-10">
            <p className="text-sm text-white/50 uppercase tracking-widest font-semibold mb-1">Booking Reference</p>
            <p className="font-mono text-xl text-primary font-bold">{bookingId}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="flex-1 h-12 font-bold shadow-lg shadow-primary/20 rounded-xl">
              <Link to="/account/bookings">View Booking</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 h-12 font-bold rounded-xl bg-white/5 border-white/10 hover:bg-white/10">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function BookingFailurePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-background flex items-center justify-center relative overflow-hidden">
      <SEO title="Payment Failed | CS Cinemas" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="container mx-auto px-4 max-w-lg relative z-10"
      >
        <div className="glass-card p-10 md:p-14 rounded-3xl border border-white/10 text-center shadow-2xl flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8"
          >
            <XCircle className="w-12 h-12 text-red-500" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white font-heading tracking-tight mb-4">Payment Failed</h1>
          <p className="text-text-muted text-lg mb-10">We couldn't process your payment at this time. No charges were made to your account.</p>
          
          <div className="w-full">
            <Button asChild className="w-full h-12 font-bold rounded-xl">
              <Link to="/theaters">Try Again <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
