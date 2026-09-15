import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export function EmptyState({ 
  title = "No results found", 
  description = "We couldn't find what you're looking for.", 
  actionText, 
  actionLink,
  icon: Icon = PackageOpen 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-text-muted mb-6 border border-surface-hover">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-text-muted max-w-sm mb-8">{description}</p>
      
      {actionText && actionLink && (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={actionLink}>{actionText}</Link>
        </Button>
      )}
    </motion.div>
  );
}
