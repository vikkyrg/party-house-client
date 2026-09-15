import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await authService.login({ email: data.email, password: data.password });
      if (response.success) {
        setAuth(response.data.user, response.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <SEO title="Sign In | CS Cinemas" />
      
      {/* Background elements */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <Link to="/" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-background shadow-lg shadow-primary/20 mb-6 group hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect x="2" y="2" width="20" height="20" rx="2.5" />
                <path d="M2 12h20" />
                <path d="M12 2v20" />
                <path d="M7 2v20" />
                <path d="M17 2v20" />
              </svg>
            </Link>
            <h1 className="text-3xl font-black text-white font-heading tracking-tight mb-2">Welcome Back</h1>
            <p className="text-text-muted">Sign in to book your premium celebrations</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
              <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm text-center">
                {error}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@example.com"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                {...register('email')}
              />
              {errors.email && <p className="mt-1.5 text-xs font-medium text-error flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-white/90">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/20"
                {...register('password')}
              />
              {errors.password && <p className="mt-1.5 text-xs font-medium text-error flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-error" />{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl mt-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:text-primary font-semibold transition-colors">
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
