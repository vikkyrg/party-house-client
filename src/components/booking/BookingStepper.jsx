import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function BookingStepper({ steps, currentStep }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#ecdcd1] z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#9e6223] z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-[#9e6223] text-white' 
                    : isCurrent 
                      ? 'bg-white border-2 border-[#9e6223] text-[#9e6223] shadow-sm'
                      : 'bg-white border-2 border-[#ecdcd1] text-[#a6998f]'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`absolute -bottom-6 text-xs whitespace-nowrap font-bold tracking-wide ${isCurrent || isCompleted ? 'text-[#1a1c21]' : 'text-[#a6998f]'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
