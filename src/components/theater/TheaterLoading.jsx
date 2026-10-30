import React from 'react';
import { Film, Clapperboard, Sparkles } from 'lucide-react';

/**
 * TheaterLoading
 *
 * Luxury cinema-inspired film-strip loading animation:
 * - Refined horizontal film strip with deep navy/charcoal base (#161622)
 * - Ultra-thin warm champagne golden border (#C59B4E)
 * - Realistic rectangular film sprockets (top & bottom)
 * - Smooth, continuous, liquid-gold progress bar without bulky segment breaks
 * - Subtle flowing frame divisions & animated cinematic reel glint
 * - Crisp Rio Party House branding & typography (#2F2859, #8A4B12, #74695D)
 * - Fully responsive on mobile, tablet, and desktop
 */
export function TheaterLoading({ progress = 0 }) {
  const displayPercent = Math.min(100, Math.max(0, Math.floor(progress)));

  return (
    <div className="min-h-screen bg-[#FDF5EA] flex flex-col items-center justify-center px-4 py-16 select-none font-sans">
      <div className="w-full max-w-[460px] flex flex-col items-center">
        
        {/* Brand Header & Cinema Icon Badge */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2F2859] border border-[#C59B4E]/60 flex items-center justify-center shadow-[0_4px_16px_rgba(47,40,89,0.25)]">
            <Film className="w-5 h-5 text-[#F5E2B3] stroke-[1.8]" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8A4B12]">
            RIO PARTY HOUSE
          </span>
        </div>

        {/* Headings */}
        <h2 className="text-[26px] sm:text-[30px] font-heading font-black text-[#2F2859] tracking-tight text-center leading-tight mb-1.5">
          Preparing Your Theater Experience
        </h2>
        <p className="text-[13px] font-medium text-[#74695D] text-center mb-8 max-w-[360px] leading-snug">
          Loading private theater suites, rooms & availability
        </p>

        {/* Film Strip Progress Bar Card */}
        <div className="w-full relative rounded-2xl p-[1.5px] bg-gradient-to-r from-[#B87525]/60 via-[#E4C389] to-[#B87525]/60 shadow-[0_12px_32px_-6px_rgba(47,40,89,0.18)]">
          <div className="w-full bg-[#14141E] rounded-[15px] p-2 sm:p-2.5 overflow-hidden border border-black/80 flex flex-col justify-between gap-1.5">
            
            {/* Top Film Sprocket Track */}
            <div className="flex items-center justify-between px-1">
              {[...Array(15)].map((_, i) => (
                <div
                  key={`sprocket-top-${i}`}
                  className="w-3 h-2 rounded-[2px] bg-[#0A0A10] border border-[#252538] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                />
              ))}
            </div>

            {/* Middle Film Frame Area: Continuous, Smooth Golden Fill */}
            <div className="relative w-full h-8 sm:h-9 rounded-lg bg-[#1B1B26] overflow-hidden border border-[#2A2A3C] shadow-inner flex items-center">
              
              {/* Subtle Film Frame Divider Lines (Very soft, non-intrusive) */}
              <div className="absolute inset-0 flex justify-between pointer-events-none z-20 opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`frame-line-${i}`}
                    className="h-full w-[1px] bg-gradient-to-b from-transparent via-[#E2C792] to-transparent"
                  />
                ))}
              </div>

              {/* Smooth Continuous Gold Fill Indicator */}
              <div
                className="h-full bg-gradient-to-r from-[#B37B24] via-[#DDAA4B] to-[#FBF0CB] transition-all duration-200 ease-out relative z-10 shadow-[0_0_16px_rgba(221,170,75,0.45)]"
                style={{ width: `${progress}%` }}
              >
                {/* Cinema Light Shimmer Glint at leading edge */}
                {progress > 2 && progress < 100 && (
                  <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-white/70" />
                )}
              </div>
            </div>

            {/* Bottom Film Sprocket Track */}
            <div className="flex items-center justify-between px-1">
              {[...Array(15)].map((_, i) => (
                <div
                  key={`sprocket-bot-${i}`}
                  className="w-3 h-2 rounded-[2px] bg-[#0A0A10] border border-[#252538] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                />
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Percentage Counter & Real-Time Status */}
        <div className="w-full flex items-center justify-between mt-3.5 px-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B87525] animate-ping" />
            <span className="text-[12px] font-semibold text-[#8A4B12] tracking-wide">
              {displayPercent < 100 ? 'Configuring private suites...' : 'Ready for showtime!'}
            </span>
          </div>
          <span className="font-mono text-base font-black text-[#2F2859] tracking-tight">
            {displayPercent}%
          </span>
        </div>

      </div>
    </div>
  );
}

export default TheaterLoading;
