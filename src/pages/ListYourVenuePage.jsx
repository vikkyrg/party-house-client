import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SEO } from '../components/common/SEO';

export function ListYourVenuePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your venue request has been received. Our team will contact you soon.');
      setFormData({ name: '', phone: '', email: '', city: '' });
    }, 1500);
  };

  const whyPartner = [
    'Showcase your venue to customers',
    'Manage your theater and rooms',
    'Define room details and capacity',
    'Set room pricing',
    'Configure available time slots',
    'Manage venue information',
    'Receive booking requests and reservations',
    'Keep availability organized',
  ];

  const howItWorks = [
    { title: 'Submit your venue details', desc: 'Share your space details, room setup, and pricing information.' },
    { title: 'Our team reviews the information', desc: 'We assess the venue information and ensure it meets the required listing details.' },
    { title: 'Add your theater and rooms', desc: 'Create room profiles and define the experience you offer.' },
    { title: 'Configure pricing and available time slots', desc: 'Set rates and schedule the availability customers can book.' },
    { title: 'Publish your venue', desc: 'Once approved, the venue becomes available to customers.' },
    { title: 'Manage bookings through the platform', desc: 'Track reservations and keep your venue information up to date.' },
  ];

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 font-sans">
      <SEO title="List Your Venue | RIO PARTY HOUSE" description="Partner with RIO PARTY HOUSE to list your private venue and make it available to customers looking for memorable celebration experiences." />
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 mb-24">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">RIO PARTY HOUSE</span>
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
        </div>

        <h1 className="text-center text-[40px] md:text-[56px] font-heading font-extrabold text-[#1a1c21] mb-5 leading-[1.1]">
          List Your Venue with RIO PARTY HOUSE
        </h1>
        <p className="mx-auto max-w-3xl text-center text-[#6b5c52] text-[16px] md:text-[18px] leading-[1.8]">
          Have a private theater, celebration room, party venue, or entertainment space? Partner with RIO PARTY HOUSE and make your venue available to customers looking for memorable private experiences.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 mb-24">
        <h2 className="text-[32px] md:text-[40px] font-heading font-extrabold text-[#1a1c21] mb-8">
          Why List With Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyPartner.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[16px] p-6 border border-[#f0e6dd] shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#fdf5eb] flex items-center justify-center shrink-0">
                <span className="text-[#9e6223] font-bold text-[16px]">{idx + 1}</span>
              </div>
              <p className="text-[#1a1c21] font-medium text-[15px] leading-[1.6]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 mb-24">
        <h2 className="text-[32px] md:text-[40px] font-heading font-extrabold text-[#1a1c21] mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {howItWorks.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[16px] p-8 border border-[#f0e6dd] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f5e5d7] text-[#8c5211] font-bold">{idx + 1}</div>
              <h3 className="text-[#1a1c21] font-bold text-[18px] mb-3">{item.title}</h3>
              <p className="text-[#6b5c52] font-medium text-[15px] leading-[1.6]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f29f43] py-20 px-5">
        <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-heading font-extrabold text-[#1a1c21] mb-2">
              List Your Venue
            </h2>
            <p className="text-[#6b5c52] font-medium text-[16px] leading-[1.7]">
              Share your venue details and our team will review the information to help you get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Your Full Name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email ID"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-4 bg-[#322a59] text-white rounded-[12px] font-bold text-[16px] shadow-lg hover:bg-[#1f1a38] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'List Your Venue'
              )}
            </button>

            <p className="text-center text-[13px] font-medium text-gray-500 mt-6">
              We will review your venue listing and contact you with the next steps.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
