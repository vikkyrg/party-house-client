import React from 'react';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export function HelpPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 font-sans relative overflow-hidden">
      <SEO title="Help Center | CS Cinemas" />
      
      <div className="container mx-auto px-6 md:px-12 max-w-4xl relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#8c5211] mb-4 block">Support</span>
          <h1 className="text-[40px] md:text-[54px] font-heading text-[#1a1c21] font-extrabold mb-6 leading-tight">
            How can we help you?
          </h1>
          <p className="text-[#6b5c52] font-medium text-[15px] md:text-lg max-w-2xl mx-auto">
            Find answers to common questions or reach out to our team for personalized assistance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="bg-white p-8 rounded-[32px] border border-[#f0e6dd] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-[#f4e6d9] rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-[#8c5211]" />
            </div>
            <h3 className="text-xl font-bold font-heading text-[#1a1c21] mb-3">Live Chat Support</h3>
            <p className="text-[#6b5c52] text-sm mb-6">Chat with our support team instantly for quick resolutions to your issues.</p>
            <button className="px-6 py-3 bg-[#9e6223] text-white font-bold text-sm rounded-full hover:bg-[#7a4b1b] transition-colors mt-auto">
              Start Chat
            </button>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            className="bg-white p-8 rounded-[32px] border border-[#f0e6dd] shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-[#f4e6d9] rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-[#8c5211]" />
            </div>
            <h3 className="text-xl font-bold font-heading text-[#1a1c21] mb-3">Email Us</h3>
            <p className="text-[#6b5c52] text-sm mb-6">Send us an email and our team will get back to you within 24 hours.</p>
            <a href="mailto:riopartyhouse@gmail.com" className="px-6 py-3 bg-white text-[#9e6223] border-2 border-[#9e6223] font-bold text-sm rounded-full hover:bg-[#F9F6F0] transition-colors mt-auto">
              riopartyhouse@gmail.com
            </a>
          </motion.div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          className="mt-16 bg-white p-10 rounded-[32px] border border-[#f0e6dd] shadow-[0_8px_40px_rgb(0,0,0,0.06)]"
        >
          <h2 className="text-2xl font-bold font-heading text-[#1a1c21] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[#1a1c21] mb-2 text-[15px]">How do I cancel my booking?</h4>
              <p className="text-[#6b5c52] text-sm">You can cancel your booking up to 24 hours in advance for a full refund by visiting the 'Booking History' section in your account.</p>
            </div>
            <hr className="border-[#f0e6dd]"/>
            <div>
              <h4 className="font-bold text-[#1a1c21] mb-2 text-[15px]">Can I bring my own food?</h4>
              <p className="text-[#6b5c52] text-sm">Outside food is not permitted. However, we offer a wide variety of gourmet snacks and beverages that can be added to your booking.</p>
            </div>
            <hr className="border-[#f0e6dd]"/>
            <div>
              <h4 className="font-bold text-[#1a1c21] mb-2 text-[15px]">What format should my movie be in?</h4>
              <p className="text-[#6b5c52] text-sm">You can cast your content directly from any popular streaming service or bring a USB drive with MP4/MKV files.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
