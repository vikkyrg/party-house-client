import { Link } from 'react-router-dom';

export function PlaceholderPage({ title }) {
  const contentMap = {
    'About Us': 'RIO PARTY HOUSE is dedicated to redefining how you celebrate your special moments. We believe that life\'s greatest milestones deserve to be celebrated on the big screen. From private theatre bookings to customized event planning, we offer a cinematic experience unlike any other.',
    'Founders': 'Our visionary founders started RIO PARTY HOUSE with a simple goal: to make luxury private theatre experiences accessible to everyone. With decades of combined experience in hospitality and entertainment, they have built a platform that turns ordinary birthdays into extraordinary memories.',
    'List Your Venue': 'Do you own a premium private theatre or event space? Partner with RIO PARTY HOUSE to maximize your bookings. Our platform connects thousands of users looking to celebrate birthdays, anniversaries, and corporate events with the best venues in town.',
    'Refund Policy': 'We strive to provide a seamless booking experience. Cancellations made at least 48 hours before the scheduled event are eligible for a full refund. Cancellations within 48 hours may be subject to a cancellation fee. Please contact support for any disputes.',
  };

  const textContent = contentMap[title] || 'This section is currently being updated with exciting new information. Please check back soon to learn more about our services and offerings.';

  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      {/* Background SVG Decors */}
      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-5 sm:px-10 lg:px-20 max-w-4xl relative z-10 text-center">
        
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">
            RIO PARTY HOUSE
          </span>
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
        </div>

        <h1 className="text-[40px] md:text-[56px] font-heading font-extrabold text-[#1a1c21] mb-10 leading-[1.1]">
          {title}
        </h1>

        <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#f0e6dd] text-left">
          <p className="text-[18px] md:text-[20px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap">
            {textContent}
          </p>

          <div className="mt-12 pt-8 border-t border-[#f0e6dd] flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#9e6223] font-bold tracking-wide uppercase">Need more details?</p>
            <Link to="/contact" className="px-8 py-3 bg-[#1a1c21] text-white rounded-full font-bold hover:bg-[#8c5211] transition-colors shadow-md">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
