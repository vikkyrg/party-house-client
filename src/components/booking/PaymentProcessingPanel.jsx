import React, { useState, useEffect } from 'react';
import { Film, ShieldCheck } from 'lucide-react';

/**
 * PaymentProcessingPanel
 *
 * Dedicated cinema film-strip payment processing state for the Booking Review page.
 * Controlled progress behavior:
 * - 0–30%: Initial reservation & slot verification
 * - 30–60%: Preparing secure advance payment
 * - 60–85%: Generating booking reference & QR details
 * - 85–90%: Finalizing reservation hold
 * - 100%: Completed on API success (brief pause before showing QR modal)
 */
export function PaymentProcessingPanel({
  isSubmitting,
  onComplete,
  error,
  advanceAmount = 750,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    if (error) {
      return;
    }

    if (isSubmitting) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 4;
          if (prev < 60) return prev + 2.5;
          if (prev < 85) return prev + 1.2;
          if (prev < 89) return prev + 0.4;
          return prev; // holds at ~89% until backend API responds
        });
      }, 60);
    } else {
      // Once API call finishes successfully
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            const next = prev + 5;
            return next >= 100 ? 100 : next;
          }
          clearInterval(timer);
          return 100;
        });
      }, 20);
    }

    return () => clearInterval(timer);
  }, [isSubmitting, error]);

  useEffect(() => {
    if (progress >= 100 && !isSubmitting && onComplete) {
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 200);
      return () => clearTimeout(exitTimer);
    }
  }, [progress, isSubmitting, onComplete]);

  const displayPercent = Math.min(100, Math.floor(progress));

  const getStatusText = () => {
    if (displayPercent < 30) return 'Initiating secure reservation...';
    if (displayPercent < 60) return 'Configuring ₹' + advanceAmount + ' advance payment...';
    if (displayPercent < 85) return 'Securing theater slot & lock...';
    if (displayPercent < 100) return 'Verifying reservation hold...';
    return 'Reservation secured! Preparing UPI payment...';
  };

  return (
    <div className="w-full rounded-2xl border border-[#ecdcd1] bg-[#fffaf5] p-5 shadow-[0_10px_30px_rgba(75,43,20,0.06)] select-none">
      <div className="flex flex-col items-center max-w-md mx-auto">
        
        {/* Header Icon & Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#2F2859] border border-[#B87525]/60 flex items-center justify-center text-[#F5E2B3] shadow-xs">
            <Film className="w-4 h-4 text-[#F5E2B3]" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#8A4B12]">
            RIO PARTY HOUSE
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-heading font-black text-[#2F2859] tracking-tight text-center">
          Processing Your Payment
        </h4>
        <p className="text-xs text-[#74695D] text-center mb-4 leading-tight">
          Please wait while we securely lock your theater slot and prepare advance payment.
        </p>

        {/* Film Strip Progress Bar */}
        <div className="w-full relative rounded-xl p-[1.5px] bg-gradient-to-r from-[#B87525]/60 via-[#E4C389] to-[#B87525]/60 shadow-xs">
          <div className="w-full bg-[#14141E] rounded-[11px] p-1.5 sm:p-2 overflow-hidden border border-black/80 flex flex-col justify-between gap-1">
            
            {/* Top Sprocket Track */}
            <div className="flex items-center justify-between px-1">
              {[...Array(14)].map((_, i) => (
                <div
                  key={`sprocket-top-${i}`}
                  className="w-2.5 h-1.5 rounded-[1.5px] bg-[#0A0A10] border border-[#252538]"
                />
              ))}
            </div>

            {/* Middle Film Frame Area: Continuous Golden Fill */}
            <div className="relative w-full h-7 sm:h-8 rounded-md bg-[#1B1B26] overflow-hidden border border-[#2A2A3C] shadow-inner flex items-center">
              
              {/* Subtle Frame Divider Lines */}
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
                className="h-full bg-gradient-to-r from-[#B37B24] via-[#DDAA4B] to-[#FBF0CB] transition-all duration-150 ease-out relative z-10 shadow-[0_0_14px_rgba(221,170,75,0.45)]"
                style={{ width: `${progress}%` }}
              >
                {progress > 2 && progress < 100 && (
                  <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-r from-transparent to-white/70" />
                )}
              </div>
            </div>

            {/* Bottom Sprocket Track */}
            <div className="flex items-center justify-between px-1">
              {[...Array(14)].map((_, i) => (
                <div
                  key={`sprocket-bot-${i}`}
                  className="w-2.5 h-1.5 rounded-[1.5px] bg-[#0A0A10] border border-[#252538]"
                />
              ))}
            </div>

          </div>
        </div>

        {/* Counter and Dynamic Status Microcopy */}
        <div className="w-full flex items-center justify-between mt-2.5 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B87525] animate-ping" />
            <span className="text-[11px] font-semibold text-[#8A4B12] truncate max-w-[240px]">
              {getStatusText()}
            </span>
          </div>
          <span className="font-mono text-sm font-black text-[#2F2859]">
            {displayPercent}%
          </span>
        </div>

      </div>
    </div>
  );
}

export default PaymentProcessingPanel;

