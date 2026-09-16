import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("shimmer rounded-xl bg-surface-strong/70 border border-white/5", className)}
      {...props}
    />
  );
}

