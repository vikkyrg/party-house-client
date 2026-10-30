import { SEO } from '../components/common/SEO';

export function ListYourVenuePage() {
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
    </div>
  );
}
