import React from 'react';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';

export function SitemapPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 font-sans relative overflow-hidden">
      <SEO title="Sitemap | RIO PARTY HOUSE" />
      
      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#8c5211] mb-4 block">Our Location</span>
          <h1 className="text-[40px] md:text-[54px] font-heading text-[#1a1c21] font-extrabold mb-4 leading-tight">
            RT Nagar, Bengaluru
          </h1>
          <p className="text-[#6b5c52] font-medium text-[15px] md:text-lg max-w-2xl mx-auto mb-6">
            No 7, 3rd Floor, Dinnur Main Road, RT Nagar - Bangalore 560032
          </p>
          <a
            href="https://www.google.com/maps/place/13%C2%B001'22.9%22N+77%C2%B036'03.9%22E/@13.0230255,77.5985146,851m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d13.0230255!4d77.6010895?hl=en&entry=ttu&g_ep=EgoyMDI2MTAyNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#A76520] hover:bg-[#8e5217] text-white text-[13px] font-bold transition shadow-md"
          >
            <span>Open in Google Maps</span>
            <span>↗</span>
          </a>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="bg-white p-4 md:p-6 rounded-[32px] border border-[#f0e6dd] shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden"
        >
          <div className="w-full h-[600px] rounded-[24px] overflow-hidden bg-[#F9F6F0]">
            <iframe 
              src="https://maps.google.com/maps?q=13.0230255,77.6010895&hl=en&z=17&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Rio Party House Location - Dinnur Main Road, RT Nagar, Bengaluru"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
