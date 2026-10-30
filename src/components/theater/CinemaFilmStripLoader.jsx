import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

/**
 * CinemaFilmStripLoader
 *
 * Premium cinema-inspired loading screen featuring:
 * - A horizontal cinema film-strip progress bar
 * - Dark charcoal/black film-strip background with film frames and perforation holes
 * - Rounded outer border with a premium golden / warm amber color
 * - White/golden progress indicator that fills the film strip from left to right
 * - Percentage counter displayed from 0% to 100%
 * - Cinema icon above progress bar
 * - Smooth transition when data fetching completes
 */
export function CinemaFilmStripLoader({
  isLoading,
  onComplete,
  error,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    if (error) {
      return;
    }

    if (isLoading) {
      // Progress from 0 towards 90% while pending
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 4;
          if (prev < 65) return prev + 2.5;
          if (prev < 88) return prev + 1;
          return prev; // hold at ~88% until API response arrives
        });
      }, 70);
    } else {
      // API call completed successfully -> smoothly complete to 100%
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            const next = prev + 5;
            return next >= 100 ? 100 : next;
          }
          clearInterval(timer);
          return 100;
        });
      }, 25);
    }

    return () => clearInterval(timer);
  }, [isLoading, error]);

  // When reaching 100%, hold briefly (250ms) then trigger onComplete
  useEffect(() => {
    if (progress >= 100 && !isLoading && onComplete) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 250);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, isLoading, onComplete]);

  const displayPercent = Math.min(100, Math.floor(progress));

  return (
    <div className="min-h-[520px] w-full flex flex-col items-center justify-center p-6 bg-[#fcf5eb] select-none">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Cinema Icon & Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#2a2420] text-[#e0a96d] border border-[#d4af37]/40 flex items-center justify-center shadow-md animate-pulse">
            <Film className="w-5 h-5 text-[#e0a96d]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8c5211]">
            Rio Party House
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-heading font-extrabold text-[#1f1a16] mb-1 tracking-tight">
          Preparing Cinema Experiences
        </h3>
        <p className="text-xs text-[#7c695b] mb-6">
          Loading private theater suites & availability
        </p>

        {/* Film Strip Progress Bar Container */}
        <div className="w-full relative p-1 rounded-2xl bg-gradient-to-r from-[#b38728] via-[#fbf5b7] to-[#aa771c] shadow-[0_8px_25px_-5px_rgba(140,82,17,0.3)]">
          <div className="relative w-full h-14 bg-[#141416] rounded-[14px] overflow-hidden flex flex-col justify-between p-1.5 border border-black/40">
            {/* Top Film Sprocket Holes */}
            <div className="flex justify-between items-center px-1">
              {[...Array(14)].map((_, i) => (
                <div
                  key={`top-${i}`}
                  className="w-2.5 h-1.5 rounded-[2px] bg-[#2a2b30] border border-black/60 shadow-inner"
                />
              ))}
            </div>

            {/* Middle Film Frame Area with Horizontal Fill */}
            <div className="relative w-full h-6 mx-auto rounded bg-[#1c1d22] overflow-hidden border border-[#2f3037] flex items-center">
              {/* Frame Dividing Grid lines */}
              <div className="absolute inset-0 flex justify-between pointer-events-none z-10">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={`divider-${i}`}
                    className="h-full w-[2px] bg-[#141416]/90 border-r border-[#3a3b45]/30"
                  />
                ))}
              </div>

              {/* Progress Fill Bar */}
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#ffffff] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Film Sprocket Holes */}
            <div className="flex justify-between items-center px-1">
              {[...Array(14)].map((_, i) => (
                <div
                  key={`bot-${i}`}
                  className="w-2.5 h-1.5 rounded-[2px] bg-[#2a2b30] border border-black/60 shadow-inner"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Percentage Counter */}
        <div className="w-full flex items-center justify-between mt-3 px-1">
          <span className="text-[11px] font-semibold text-[#8c5211] tracking-wide">
            {displayPercent < 100 ? 'Configuring slots & rooms...' : 'Ready!'}
          </span>
          <span className="font-mono text-sm font-extrabold text-[#8c5211]">
            {displayPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default CinemaFilmStripLoader;

