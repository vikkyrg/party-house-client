import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';

export function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-text-muted text-center mb-12">We'd love to hear from you. Get in touch with our support team.</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Email Us</h3>
                <p className="text-text-muted text-sm mb-2">Our friendly team is here to help.</p>
                <a href="mailto:riopartyhouse@gmail.com" className="text-primary hover:underline font-medium">riopartyhouse@gmail.com</a>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Call Us</h3>
                <p className="text-text-muted text-sm mb-2">Mon-Sat from 10am to 7pm.</p>
                <a href="tel:+918147897771" className="text-primary hover:underline font-medium">+91 8147 897771</a>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Office</h3>
                <p className="text-text-muted text-sm">
                  123 Cinema Road, Koramangala<br />
                  Bengaluru, Karnataka 560034<br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">Send a message</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Name</label>
                <input type="text" className="w-full h-12 bg-surface/50 border border-surface-hover rounded-xl px-4 text-white focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Email</label>
                <input type="email" className="w-full h-12 bg-surface/50 border border-surface-hover rounded-xl px-4 text-white focus:ring-2 focus:ring-primary focus:outline-none" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-muted">Message</label>
                <textarea className="w-full h-32 bg-surface/50 border border-surface-hover rounded-xl p-4 text-white focus:ring-2 focus:ring-primary focus:outline-none resize-none" placeholder="How can we help?" />
              </div>
              <Button type="submit" className="w-full h-12 font-bold mt-2">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqPage() {
  const { data: faqsRes, isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => contentService.getFaqs(),
  });

  const faqs = faqsRes?.data || [];

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] max-w-3xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-text-muted text-center mb-12">Everything you need to know about celebrating with us.</p>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center p-8 text-text-muted">Loading FAQs...</div>
        ) : faqs.length > 0 ? (
          faqs.map((faq, i) => (
            <div key={faq._id || i} className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2 text-primary">{faq.question}</h3>
              <p className="text-text-muted leading-relaxed">{faq.answer}</p>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-text-muted bg-surface rounded-xl">No FAQs available at the moment.</div>
        )}
      </div>

      <div className="mt-12 text-center p-8 bg-surface rounded-2xl border border-surface-hover">
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="text-text-muted mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
        <Button asChild>
          <Link to="/contact">Get in touch</Link>
        </Button>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] max-w-3xl prose prose-invert">
      <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
      <div className="glass-card p-8 rounded-2xl text-text-muted space-y-6">
        <p>Last updated: September 2026</p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using CS Cinemas, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Booking Policy</h2>
        <p>All bookings are subject to availability. CS Cinemas reserves the right to cancel any booking under unforeseen circumstances.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Payment & Refunds</h2>
        <p>Payments are securely processed via Razorpay. Refunds for cancellations are processed according to the specific cancellation policy of the booked theater.</p>

        <p className="mt-8 italic text-sm">This is a placeholder document. Replace with actual legal terms.</p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh] max-w-3xl prose prose-invert">
      <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
      <div className="glass-card p-8 rounded-2xl text-text-muted space-y-6">
        <p>Last updated: September 2026</p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, and authenticate users.</p>

        <p className="mt-8 italic text-sm">This is a placeholder document. Replace with actual legal terms.</p>
      </div>
    </div>
  );
}
