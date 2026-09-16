import { SEO } from '../components/common/SEO';
import { Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080808] pt-32 pb-24">
      <SEO title="Contact Us | CS Cinemas" />

      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="max-w-2xl mb-16">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-text-muted mb-4 block">Get in Touch</span>
          <h1 className="text-4xl md:text-6xl font-heading text-white mb-6">We're here for you.</h1>
          <p className="text-lg font-sans text-text-muted leading-relaxed">
            Whether you have questions about booking a private screening, customizing your event, or partnership opportunities, our hospitality team is ready to assist.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start border-t border-white/5 pt-16">
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-heading text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="text-xs font-sans font-bold uppercase tracking-widest text-text-muted mb-1">Email</p>
                    <a href="mailto:riopartyhouse@gmail.com" className="text-lg font-sans text-white hover:text-primary transition-colors">riopartyhouse@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="text-xs font-sans font-bold uppercase tracking-widest text-text-muted mb-1">Phone</p>
                    <a href="tel:+918147897771" className="text-lg font-sans text-white hover:text-primary transition-colors">+91 8147 897771</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="text-xs font-sans font-bold uppercase tracking-widest text-text-muted mb-1">Office</p>
                    <p className="text-lg font-sans text-white">3rd Floor, Prestige Towers<br />Bengaluru, Karnataka</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-heading text-white mb-6">Social</h3>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 border border-white/10 bg-[#151515] flex items-center justify-center text-white hover:border-primary hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 border border-white/10 bg-[#151515] flex items-center justify-center text-white hover:border-primary hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#151515] p-8 md:p-12 border border-white/5">
            <h3 className="text-2xl font-heading text-white mb-8">Send a message</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-sans text-text-muted mb-2">Name</label>
                <input type="text" className="w-full h-12 bg-[#1B1B1B] border border-white/10 px-4 text-white focus:outline-none focus:border-[#F5F1E8]" />
              </div>
              <div>
                <label className="block text-sm font-sans text-text-muted mb-2">Email</label>
                <input type="email" className="w-full h-12 bg-[#1B1B1B] border border-white/10 px-4 text-white focus:outline-none focus:border-[#F5F1E8]" />
              </div>
              <div>
                <label className="block text-sm font-sans text-text-muted mb-2">Message</label>
                <textarea className="w-full h-32 bg-[#1B1B1B] border border-white/10 p-4 text-white focus:outline-none focus:border-[#F5F1E8] resize-none" />
              </div>
              <Button type="button" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
