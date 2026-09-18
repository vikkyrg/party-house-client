import { Link } from 'react-router-dom';

export function AboutPage() {
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

      <div className="w-full mx-auto px-5 sm:px-10 lg:px-20 max-w-4xl relative z-10 text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">
            CS CINEMAS
          </span>
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
        </div>

        <h1 className="text-[40px] md:text-[56px] font-heading font-extrabold text-[#1a1c21] mb-10 leading-[1.1]">
          Our Story
        </h1>

        <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#f0e6dd] text-left">
          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap mb-6">
            It all began with a simple dream — to make celebrations grand, hassle-free, and budget-friendly for everyone. At CS Cinemas, we wanted to create spaces where joy feels effortless, emotions take center stage, and every person can celebrate their special moments exactly the way they imagine. Whether it's a birthday, proposal, family gathering, or just a reason to smile — we believe happiness deserves a setting that feels as unique as the people sharing it.
          </p>

          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap mb-6">
            From one humble beginning to now 25 branches across 12 cities — Bangalore, Hyderabad, Delhi NCR, Mumbai, Pune, Chennai, Ahmedabad, Lucknow and Vizag — CS Cinemas has grown into India's favorite destination for private celebrations. With over 2.25 lakh celebrations hosted, we've seen laughter, love, and memories come alive every single day. Each story adds another heartbeat to our journey and reminds us why we started — to make joy accessible, simple, and deeply personal.
          </p>

          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] whitespace-pre-wrap mb-10">
            What drives us isn't just business; it's our belief in people. Our core values — customer-centricity, emotional bonding, empathy, and honesty — guide everything we do. From the way we design every room to how we greet every guest, we strive to make every experience genuine and heartfelt. Because at CS Cinemas, we're not just building spaces — we're building emotions, one celebration at a time.
          </p>

          <div className="mt-6 pt-8 border-t border-[#f0e6dd] flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#9e6223] font-bold tracking-wide uppercase">Meet our team</p>
            <Link to="/founders" className="px-8 py-3 bg-[#1a1c21] text-white rounded-full font-bold hover:bg-[#8c5211] transition-colors shadow-md">
              Founders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
