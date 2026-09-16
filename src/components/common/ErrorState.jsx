import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 min-h-[50vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#151515] border border-white/5 p-12 text-center max-w-lg w-full shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-full animate-ping bg-red-500/10 opacity-50" style={{ animationDuration: '3s' }} />
          <AlertCircle className="w-10 h-10 text-red-500 relative z-10" />
        </div>
        
        <h3 className="text-2xl font-heading text-white mb-4 tracking-wide">
          Information Unavailable
        </h3>
        
        <p className="text-text-muted font-sans mb-10 leading-relaxed text-sm">
          {typeof error === 'string' ? error : error?.message || 'We are experiencing a temporary issue accessing this information. Please try again shortly.'}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white border border-white/20 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        )}
      </motion.div>
    </div>
  );
}
