import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function BookingStepper({ steps, currentStep }) {
  return (
    <div className="w-full py-5 px-1">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-px bg-[#ead9ca] z-0" />
        <div 
          className="absolute left-0 top-5 -translate-y-1/2 h-px bg-[#a9651c] z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-[#a9651c] text-white' 
                    : isCurrent 
                      ? 'bg-[#fffaf5] border border-[#a9651c] text-[#a9651c] shadow-sm'
                      : 'bg-[#fffaf5] border border-[#ead9ca] text-[#a6998f]'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
                <span className={`absolute -bottom-6 text-[10px] whitespace-nowrap font-bold tracking-wide ${isCurrent || isCompleted ? 'text-[#17171c]' : 'text-[#a6998f]'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
