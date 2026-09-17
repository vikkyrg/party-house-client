import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/common/SEO';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden font-sans">
      <SEO title="Page Not Found | CS Cinemas" />
      
      {/* Background glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-[100px] pointer-events-none opacity-80" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-md"
      >
        <div className="w-24 h-24 rounded-[28px] bg-gradient-to-b from-white to-[#F9F6F0] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white flex items-center justify-center mx-auto mb-6">
          <Film className="w-10 h-10 text-[#eaddd0]" />
        </div>
        
        <h1 className="text-[100px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-[#8c5211] to-[#d8a471] font-heading tracking-tighter mb-2">
          404
        </h1>
        
        <h2 className="text-3xl font-bold text-white mb-6 font-heading" style={{ textShadow: '0 4px 15px rgba(140, 82, 17, 0.25), 0 1px 2px rgba(140, 82, 17, 0.4)' }}>
          Scene Missing
        </h2>
        
        <p className="text-[#6b5c52] text-[15px] font-medium mb-10 leading-[1.7]">
          Looks like this page didn't make the final cut. The content you're looking for has been moved or no longer exists.
        </p>
        
        <Link to="/" className="inline-flex items-center justify-center h-12 px-8 font-bold text-[14px] bg-[#9e6223] text-white rounded-full hover:bg-[#7a4b1b] transition-colors shadow-[0_4px_15px_rgb(158,98,35,0.3)] mx-auto">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Homepage
        </Link>
      </motion.div>
    </div>
  );
}
