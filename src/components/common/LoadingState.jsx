import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LoadingState({ className }) {
  return (
    <div className={cn("flex min-h-[400px] w-full flex-col items-center justify-center gap-4 text-text-muted", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Loading...</p>
    </div>
  );
}
