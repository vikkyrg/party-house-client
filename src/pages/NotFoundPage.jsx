import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <SEO title="Page Not Found | CS Cinemas" />
      
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md"
      >
        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Film className="w-10 h-10 text-white/40" />
        </div>
        
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-hover font-heading tracking-tighter mb-4 filter drop-shadow-lg">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4 font-heading">Scene Missing</h2>
        <p className="text-text-muted text-lg mb-10 leading-relaxed">
          Looks like this page didn't make the final cut. The content you're looking for has been moved or no longer exists.
        </p>
        
        <Button asChild className="h-12 px-8 font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Return to Homepage</Link>
        </Button>
      </motion.div>
    </div>
  );
}
