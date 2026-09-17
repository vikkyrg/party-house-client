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
      <SEO title="Sitemap | CS Cinemas" />
      
      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#8c5211] mb-4 block">Our Location</span>
          <h1 className="text-[40px] md:text-[54px] font-heading text-[#1a1c21] font-extrabold mb-6 leading-tight">
            Bengaluru Map
          </h1>
          <p className="text-[#6b5c52] font-medium text-[15px] md:text-lg max-w-2xl mx-auto">
            Find our premium private screening theaters across Bengaluru.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="bg-white p-4 md:p-6 rounded-[32px] border border-[#f0e6dd] shadow-[0_8px_40px_rgb(0,0,0,0.06)] overflow-hidden"
        >
          <div className="w-full h-[600px] rounded-[24px] overflow-hidden bg-[#F9F6F0]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124415.70050720498!2d77.51470404459815!3d12.953997380183351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Bengaluru Map"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
