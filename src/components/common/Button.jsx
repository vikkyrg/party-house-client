import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default: 'bg-primary text-[#111111] hover:bg-primary-hover shadow-[0_12px_24px_rgba(214,168,79,0.22)]',
      outline: 'border border-white/10 bg-transparent text-white hover:border-primary/50 hover:bg-primary/5',
      ghost: 'text-text-muted hover:bg-white/5 hover:text-white',
      link: 'text-primary hover:text-primary-soft underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-11 px-5',
      sm: 'h-9 rounded-lg px-3 text-xs',
      lg: 'h-12 rounded-xl px-7 text-base',
      icon: 'h-10 w-10 rounded-lg',
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
