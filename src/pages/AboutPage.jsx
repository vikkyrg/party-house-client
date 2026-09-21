import { Link } from 'react-router-dom';

import { SEO } from '../components/common/SEO';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 relative overflow-hidden font-sans">
      <SEO title="About Us | RIO PARTY HOUSE" description="RIO PARTY HOUSE brings together private celebration spaces for birthdays, anniversaries, date nights, parties and other memorable occasions." />
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
            RIO PARTY HOUSE
          </span>
          <div className="h-[1px] w-8 bg-[#c2a290]"></div>
        </div>

        <h1 className="text-[40px] md:text-[56px] font-heading font-extrabold text-[#1a1c21] mb-10 leading-[1.1]">
          Celebrate Your Moments, Your Way
        </h1>

        <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#f0e6dd] text-left">
          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] mb-6">
            RIO PARTY HOUSE brings together private celebration spaces designed for memorable moments. Choose a theater, select a room, pick your preferred date and available time slot, and enjoy a private experience created around your occasion.
          </p>

          <h2 className="mt-8 mb-3 text-[22px] font-extrabold text-[#1a1c21]">Who We Are</h2>
          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] mb-6">
            RIO PARTY HOUSE is built around a simple idea: special moments deserve a space of their own. Our private rooms and entertainment spaces are designed for people who want to celebrate together in a comfortable, personal, and memorable environment.
          </p>

          <h2 className="mt-8 mb-3 text-[22px] font-extrabold text-[#1a1c21]">What We Offer</h2>
          <ul className="mb-6 list-disc space-y-2 pl-6 text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8]">
            <li>Private celebration rooms</li>
            <li>Private theater experiences</li>
            <li>Birthday celebrations</li>
            <li>Anniversary and couple experiences</li>
            <li>Movie and entertainment experiences</li>
            <li>Small parties and gatherings</li>
            <li>Customizable celebration experiences</li>
            <li>Food, cakes, add-ons, and additional services where available</li>
          </ul>

          <h2 className="mt-8 mb-3 text-[22px] font-extrabold text-[#1a1c21]">How It Works</h2>
          <ol className="mb-6 list-decimal space-y-2 pl-6 text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8]">
            <li>Explore our theaters</li>
            <li>Choose your preferred room</li>
            <li>Select your date</li>
            <li>Select an available time slot</li>
            <li>Complete your booking and payment</li>
            <li>Enjoy your private celebration</li>
          </ol>

          <h2 className="mt-8 mb-3 text-[22px] font-extrabold text-[#1a1c21]">Our Approach</h2>
          <p className="text-[16px] md:text-[18px] font-medium text-[#6b5c52] leading-[1.8] mb-10">
            From the room you choose to the time slot you book, we focus on making the reservation experience simple and transparent while giving customers a comfortable space to create their own memories.
          </p>

          <div className="mt-6 pt-8 border-t border-[#f0e6dd] flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-[#9e6223] font-bold tracking-wide uppercase">Meet the team</p>
            <Link to="/founders" className="px-8 py-3 bg-[#1a1c21] text-white rounded-full font-bold hover:bg-[#8c5211] transition-colors shadow-md">
              Founders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
