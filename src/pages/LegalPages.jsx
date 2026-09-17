import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';

export function ContactPage() {
  return null; // Note: ContactPage is now exported from its own file.
}

export function FaqPage() {
  const { data: faqsRes, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => contentService.getFaqs(),
  });

  const faqs = faqsRes?.data || [];

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
        <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 block text-center">HELP CENTER</span>
        <h1 className="text-[40px] md:text-[48px] font-heading text-[#1a1c21] font-extrabold mb-4 text-center leading-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-[15px] font-medium text-[#6b5c52] text-center mb-12">
          Everything you need to know about celebrating with us.
        </p>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-8 text-[#6b5c52] font-medium">Loading FAQs...</div>
          ) : faqs.length > 0 ? (
            faqs.map((faq, i) => (
              <div key={faq._id || i} className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd]">
                <h3 className="text-[18px] font-bold mb-3 text-[#1a1c21]">{faq.question}</h3>
                <p className="text-[14px] font-medium text-[#6b5c52] leading-[1.6]">{faq.answer}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-[#6b5c52] font-medium bg-white rounded-[24px] border border-[#f0e6dd]">
              No FAQs available at the moment.
            </div>
          )}
        </div>

        <div className="mt-12 text-center p-8 bg-[#f4e6d9] rounded-[24px] border border-[#eaddd0]">
          <h3 className="text-[20px] font-bold mb-2 text-[#1a1c21]">Still have questions?</h3>
          <p className="text-[14px] font-medium text-[#6b5c52] mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <Link to="/contact" className="inline-flex items-center justify-center px-6 h-12 bg-[#9e6223] text-white font-bold text-[14px] rounded-[16px] hover:bg-[#7a4b1b] transition-colors">
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
        <h1 className="text-[40px] md:text-[48px] font-heading text-[#1a1c21] font-extrabold mb-8 text-center">Terms of Service</h1>
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd]">
          <p className="text-[13px] font-bold text-[#8c5211] mb-8 uppercase tracking-widest">Last updated: September 2026</p>
          
          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">By accessing and using CS Cinemas, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">2. Booking Policy</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">All bookings are subject to availability. CS Cinemas reserves the right to cancel any booking under unforeseen circumstances.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">3. Payment & Refunds</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-8">Payments are securely processed via Razorpay. Refunds for cancellations are processed according to the specific cancellation policy of the booked theater.</p>

          <p className="mt-8 italic text-[13px] text-[#a6998f]">This is a placeholder document. Replace with actual legal terms.</p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative font-sans">
      <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
        <h1 className="text-[40px] md:text-[48px] font-heading text-[#1a1c21] font-extrabold mb-8 text-center">Privacy Policy</h1>
        <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd]">
          <p className="text-[13px] font-bold text-[#8c5211] mb-8 uppercase tracking-widest">Last updated: September 2026</p>
          
          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-6">We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>

          <h2 className="text-[20px] font-bold text-[#1a1c21] mt-8 mb-4">2. How We Use Information</h2>
          <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.7] mb-8">We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and authenticate users.</p>

          <p className="mt-8 italic text-[13px] text-[#a6998f]">This is a placeholder document. Replace with actual legal terms.</p>
        </div>
      </div>
    </div>
  );
}
