import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer font-sans';

    const variants = {
      default:
        'bg-[#F5F1E8] text-[#080808] shadow-sm hover:bg-[#E8DECC] active:scale-[0.98]',
      outline:
        'border border-[#F5F1E8]/20 bg-transparent text-[#F5F1E8] hover:border-[#F5F1E8] hover:bg-[#F5F1E8]/5',
      secondary:
        'bg-[#1B1B1B] text-[#F5F1E8] border border-transparent hover:border-[#F5F1E8]/20',
      ghost:
        'text-[#A9A39A] hover:text-[#F5F1E8]',
      link:
        'text-[#F5F1E8] underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      default: 'h-12 px-6',
      sm: 'h-9 px-4 text-xs',
      lg: 'h-14 px-8 text-base',
      icon: 'h-12 w-12 p-0',
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
