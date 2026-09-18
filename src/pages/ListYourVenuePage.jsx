import { useState } from 'react';
import { toast } from 'react-hot-toast';

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
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Request submitted successfully! We will contact you within 24 hours.');
      setFormData({ name: '', phone: '', email: '', city: '' });
    }, 1500);
  };

  const whoCanList = [
    "Any decorated or easy to decorate spaces",
    "Home theatres",
    "Cozy home studios, terrace or garden setups",
    "Café corners & boutique event spaces",
    "Experience-based venues with aesthetic ambience",
    "Resorts, Hotels, Airbnbs"
  ];

  const whyPartner = [
    "India's leading brand of private celebration venue - featured on Shark Tank!",
    "Reach thousands of customers actively looking for curated celebration venues.",
    "Automated inquiries & booking requests directly to you.",
    "Earn every single time your space gets booked — no hidden charges.",
    "Listing assistance & design guidance to improve your space appeal.",
    "Full marketing support: Reels, photoshoot, influencer collabs.",
    "Flexible partnership: Mutually decide pricing, slot timings, T&Cs, etc."
  ];

  const howItWorks = [
    { title: "Fill the Listing Form", desc: "Share details about your space, theme and pricing." },
    { title: "We Analyze & Propose", desc: "We verify and come up with an investment & profit-sharing plan." },
    { title: "Negotiations & Deal Finalization", desc: "Once agreed, we sign and begin execution." },
    { title: "Going Live", desc: "Your venue goes live and starts accepting bookings." },
    { title: "Getting & Executing Bookings", desc: "Customers book online, our team executes on-site." },
    { title: "Month-End Settlement", desc: "Revenue and profit settlement with full transparency." }
  ];

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 font-sans">
      
      {/* Section 1: Who Can List */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 mb-24">
        <h2 className="text-[32px] md:text-[40px] font-heading font-extrabold text-[#1a1c21] mb-4">
          Who Can List Their Venue?
        </h2>
        <p className="text-[#6b5c52] text-[16px] md:text-[18px] mb-2 max-w-3xl">
          Are you ready to showcase a space that not only looks stunning on camera but also provides a fantastic experience in person?
        </p>
        <p className="text-[#9e6223] font-medium italic text-[16px] md:text-[18px] mb-12">
          If the vibes are right, the bookings will follow!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whoCanList.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[16px] p-6 border border-[#f0e6dd] shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#fdf5eb] flex items-center justify-center shrink-0">
                <span className="text-[#9e6223] font-bold text-[16px]">{idx + 1}</span>
              </div>
              <p className="text-[#1a1c21] font-medium text-[15px]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Why Partner */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 mb-24">
        <h2 className="text-[32px] md:text-[40px] font-heading font-extrabold text-[#1a1c21] mb-4">
          Why Partner With CS Cinemas?
        </h2>
        <p className="text-[#6b5c52] text-[16px] md:text-[18px] mb-12 max-w-3xl">
          Ready to highlight a venue that dazzles both on-screen and in real life? We connect exceptional spaces with unforgettable moments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyPartner.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[16px] p-6 border border-[#f0e6dd] shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#fdf5eb] flex items-center justify-center shrink-0">
                <span className="text-[#9e6223] font-bold text-[16px]">{idx + 1}</span>
              </div>
              <p className="text-[#1a1c21] font-medium text-[15px]">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: How it works */}
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 mb-32">
        <h2 className="text-[32px] md:text-[40px] font-heading font-extrabold text-[#1a1c21] mb-12">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorks.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[16px] p-8 border border-[#f0e6dd] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow">
              <h3 className="text-[#1a1c21] font-bold text-[18px] mb-3">{item.title}</h3>
              <p className="text-[#6b5c52] font-medium text-[15px] leading-[1.6]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Contact Form */}
      <div className="bg-[#f29f43] py-20 px-5">
        <div className="max-w-2xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-[32px] font-heading font-extrabold text-[#1a1c21] mb-2">
              Ready to earn from your venue?
            </h2>
            <p className="text-[#6b5c52] font-medium text-[16px]">
              Turn your space into an experience. Turn moments into money.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input 
                type="text" 
                placeholder="Your Full Name"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email ID"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-[12px] text-[15px] text-[#1a1c21] font-medium placeholder-gray-400 focus:outline-none focus:border-[#f29f43] focus:ring-1 focus:ring-[#f29f43] transition-all"
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="City"
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
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
                'Request a Callback'
              )}
            </button>

            <p className="text-center text-[13px] font-medium text-gray-500 mt-6">
              You'll receive a personal call within 24 hours.
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}
