import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await authService.register(data);
      if (response.success) {
        navigate('/verify-otp', { state: { email: data.email } });
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <SEO title="Create Account | CS Cinemas" />

      {/* Background elements */}
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <Link to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-lg shadow-primary/20 mb-6 group hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect x="2" y="2" width="20" height="20" rx="2.5" />
                <path d="M2 12h20" />
                <path d="M12 2v20" />
                <path d="M7 2v20" />
                <path d="M17 2v20" />
              </svg>
            </Link>
            <h1 className="text-3xl font-black text-white font-heading tracking-tight mb-2">Create Account</h1>
            <p className="text-text-muted">Join CS Cinemas for premium experiences</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center">
                {error}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                {...register('name')}
              />
              {errors.name && <p className="mt-1.5 text-xs font-medium text-error flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                {...register('email')}
              />
              {errors.email && <p className="mt-1.5 text-xs font-medium text-error flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 8147897771"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                {...register('phone')}
              />
              {errors.phone && <p className="mt-1.5 text-xs font-medium text-error flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/90 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                {...register('password')}
              />
              {errors.password && <p className="mt-1.5 text-xs font-medium text-error flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl mt-4 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:text-primary font-semibold transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
