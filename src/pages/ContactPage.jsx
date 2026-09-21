import { SEO } from '../components/common/SEO';
import { Mail, Phone, MapPin, User, MessageSquare, ChevronDown, Clock, Shield, Heart, Ticket, Send } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <SEO title="Contact Us | RIO PARTY HOUSE" description="Contact RIO PARTY HOUSE for questions about theater bookings, celebrations, private room experiences, and venue partnerships." />

      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="absolute bottom-10 -left-20 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(0, 600)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
            <circle cx="0" cy="0" r="565" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[800px] hidden xl:flex flex-col justify-between pointer-events-none z-0">
        <div className="font-[cursive] text-[40px] text-[#c2a290] leading-[1.1] transform -rotate-12 opacity-80 mt-16 ml-8">
          More <br/> Than <br/> Movies
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-[1400px] relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-start">
          <div className="max-w-lg">
            <span className="font-sans text-[11px] font-bold tracking-[0.15em] uppercase text-[#8c5211] mb-4 block">GET IN TOUCH</span>
            <h1 className="text-[48px] md:text-[64px] font-heading text-[#1a1c21] font-extrabold leading-[1.1] mb-6 tracking-tight">
              Let's Plan Your <span className="bg-gradient-to-r from-[#d18428] to-[#991c4d] bg-clip-text text-transparent">Celebration</span>
            </h1>
            <p className="text-[15px] font-medium text-[#6b5c52] leading-[1.6] mb-12">
              Have a question about a theater, room, booking, celebration, or venue partnership? Our team is here to help.
            </p>

            <div className="space-y-4 mb-16">
              <div className="bg-[#f4e6d9] rounded-[24px] p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-[#eaddd0] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#8c5211]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a1c21] mb-1">Email</h3>
                  <p className="text-[13px] font-medium text-[#6b5c52] mb-2">Official support email</p>
                  <p className="text-[14px] font-bold text-[#8c5211]">[OFFICIAL EMAIL]</p>
                </div>
              </div>

              <div className="bg-[#f4e6d9] rounded-[24px] p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-[#eaddd0] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#8c5211]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a1c21] mb-1">Customer Support</h3>
                  <p className="text-[13px] font-medium text-[#6b5c52] mb-2">Available during business hours</p>
                  <p className="text-[14px] font-bold text-[#8c5211]">[PHONE NUMBER]</p>
                </div>
              </div>

              <div className="bg-[#f4e6d9] rounded-[24px] p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-[#eaddd0] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#8c5211]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a1c21] mb-1">Business Address</h3>
                  <p className="text-[13px] font-medium text-[#6b5c52] mb-2 leading-relaxed">[BUSINESS ADDRESS]</p>
                </div>
              </div>

              <div className="bg-[#f4e6d9] rounded-[24px] p-6 flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-[#eaddd0] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#8c5211]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1a1c21] mb-1">Business Hours</h3>
                  <p className="text-[13px] font-medium text-[#6b5c52] mb-2 leading-relaxed">[BUSINESS HOURS]</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#9e6223]" /><span className="text-[11px] font-bold text-[#6b5c52] leading-tight">Quick<br/>Response</span></div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-[#9e6223]" /><span className="text-[11px] font-bold text-[#6b5c52] leading-tight">Secure<br/>Support</span></div>
              <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-[#9e6223]" /><span className="text-[11px] font-bold text-[#6b5c52] leading-tight">Friendly<br/>Help</span></div>
              <div className="flex items-center gap-2"><Ticket className="w-5 h-5 text-[#9e6223]" /><span className="text-[11px] font-bold text-[#6b5c52] leading-tight">Booking<br/>Assistance</span></div>
            </div>
          </div>

          <div className="w-full max-w-[440px] lg:mx-auto">
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#f0e6dd]">
              <h2 className="text-[28px] font-heading text-[#1a1c21] font-bold mb-2 tracking-tight">Send Message</h2>
              <p className="text-[12px] font-medium text-[#6b5c52] mb-8">The form is available for enquiries. It is kept in the existing UI without claiming delivery if no backend endpoint is configured.</p>

              <form className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-[#1a1c21] mb-2">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="w-4 h-4 text-[#a6998f]" /></div>
                    <input type="text" placeholder="Your name" className="w-full bg-white border border-[#ecdcd1] rounded-[16px] pl-11 pr-4 py-3 text-[13px] font-medium text-[#1a1c21] focus:outline-none focus:border-[#8c5211] placeholder:text-[#a6998f]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1a1c21] mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="w-4 h-4 text-[#a6998f]" /></div>
                    <input type="email" placeholder="you@example.com" className="w-full bg-white border border-[#ecdcd1] rounded-[16px] pl-11 pr-4 py-3 text-[13px] font-medium text-[#1a1c21] focus:outline-none focus:border-[#8c5211] placeholder:text-[#a6998f]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1a1c21] mb-2">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="w-4 h-4 text-[#a6998f]" /></div>
                    <input type="tel" placeholder="Your phone number" className="w-full bg-white border border-[#ecdcd1] rounded-[16px] pl-11 pr-4 py-3 text-[13px] font-medium text-[#1a1c21] focus:outline-none focus:border-[#8c5211] placeholder:text-[#a6998f]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1a1c21] mb-2">Subject</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="w-4 h-4 text-[#a6998f]" /></div>
                    <select defaultValue="" className="w-full bg-white border border-[#ecdcd1] rounded-[16px] pl-11 pr-10 py-3 text-[13px] font-medium text-[#1a1c21] focus:outline-none focus:border-[#8c5211] appearance-none cursor-pointer">
                      <option value="" disabled className="text-[#a6998f]">Select a topic</option>
                      <option value="booking">Private Booking</option>
                      <option value="venue">Venue Partnership</option>
                      <option value="support">General Support</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"><ChevronDown className="w-4 h-4 text-[#1a1c21]" /></div>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#1a1c21] mb-2">Message</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 pointer-events-none"><MessageSquare className="w-4 h-4 text-[#a6998f]" /></div>
                    <textarea placeholder="How can we help you?" className="w-full bg-white border border-[#ecdcd1] rounded-[16px] pl-11 pr-4 py-3 h-[100px] text-[13px] font-medium text-[#1a1c21] focus:outline-none focus:border-[#8c5211] placeholder:text-[#a6998f] resize-none"></textarea>
                  </div>
                </div>

                <button type="button" className="w-full h-12 mt-4 bg-[#9e6223] hover:bg-[#7a4b1b] text-white font-bold text-[13px] rounded-[16px] transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
