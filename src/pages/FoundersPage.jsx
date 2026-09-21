import { Link } from 'react-router-dom';
import { SEO } from '../components/common/SEO';

export function FoundersPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <SEO
        title="Founder | RIO PARTY HOUSE"
        description="Meet the founder behind RIO PARTY HOUSE and discover the vision behind our private celebration and entertainment experiences."
      />

      <div className="absolute top-0 right-0 pointer-events-none overflow-hidden w-[600px] h-[600px] z-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
          <g transform="translate(600, 0)">
            <circle cx="0" cy="0" r="550" fill="none" stroke="#eaddd0" strokeWidth="50" />
            <circle cx="0" cy="0" r="535" fill="none" stroke="#FAF4ED" strokeWidth="12" strokeDasharray="15 15" />
          </g>
        </svg>
      </div>

      <div className="w-full mx-auto px-5 sm:px-10 lg:px-20 max-w-5xl relative z-10 text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
          <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#9e6223]">
            RIO PARTY HOUSE
          </span>
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
        </div>

        <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-heading font-extrabold text-[#1a1c21] mb-6 leading-[1.1]">
          Meet the Founder Behind RIO PARTY HOUSE
        </h1>

        <p className="max-w-3xl mx-auto text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] mb-12">
          RIO PARTY HOUSE was created with a simple idea — to make celebrations more private, personal, and memorable. What started with a passion for creating better celebration experiences has grown into a space where people can come together, celebrate, and create moments worth remembering.
        </p>

        <div className="mx-auto max-w-3xl bg-white rounded-[32px] p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#f0e6dd]">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-[#ead9ca] bg-gradient-to-br from-[#f0e4d6] via-[#f8f3ee] to-[#d9c0a4] shadow-[0_10px_25px_rgba(122,79,44,0.12)] mb-6">
              <svg viewBox="0 0 240 240" className="h-full w-full" aria-label="Founder profile illustration" role="img" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="avatarBg" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#f2e7da" />
                    <stop offset="100%" stopColor="#d7b88e" />
                  </linearGradient>
                </defs>
                <rect width="240" height="240" fill="url(#avatarBg)"/>
                <circle cx="120" cy="88" r="38" fill="#e9d5b8" />
                <path d="M75 192c12-28 35-42 45-42s33 14 45 42" fill="#c79a6e" />
                <path d="M95 70c8-22 18-34 25-34 15 0 28 10 31 32-8-6-20-8-31-8-10 0-18 3-25 10Z" fill="#b88963" opacity="0.92"/>
                <path d="M118 74c14 1 27 11 35 26-12 4-27 6-42 6-15 0-28-2-40-6 7-17 21-27 47-26Z" fill="#d9b48d" opacity="0.8"/>
              </svg>
            </div>

            <h2 className="text-[28px] md:text-[34px] font-heading font-extrabold text-[#1a1c21] tracking-tight">
              Arjun Kumar
            </h2>
            <p className="mt-2 text-[14px] md:text-[16px] font-bold uppercase tracking-[0.18em] text-[#9e6223]">
              Founder &amp; Director
            </p>
          </div>

          <div className="mt-8 max-w-2xl mx-auto text-left">
            <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8]">
              Arjun Kumar founded RIO PARTY HOUSE with a vision to create comfortable and memorable private celebration experiences. With a focus on customer experience, thoughtful spaces, and simple booking, he continues to build RIO PARTY HOUSE as a destination for birthdays, anniversaries, date nights, private movie experiences, and special occasions.
            </p>
          </div>
        </div>

        <div className="mt-14 mx-auto max-w-4xl rounded-[28px] border border-[#f0e6dd] bg-[#f7f1e9] p-7 md:p-10 text-center md:text-left">
          <h3 className="text-[24px] md:text-[30px] font-heading font-extrabold text-[#1a1c21] mb-4">
            Building Experiences That Matter
          </h3>
          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] mb-8 max-w-3xl">
            At RIO PARTY HOUSE, we believe celebrations are not just about the occasion — they are about the people, the atmosphere, and the memories created together. Our goal is to make discovering and booking a private celebration space simple, transparent, and enjoyable.
          </p>

          <div className="flex justify-center md:justify-start">
            <Link
              to="/theaters"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1a1c21] text-white rounded-full font-bold hover:bg-[#8c5211] transition-colors shadow-md"
            >
              Explore Theaters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
