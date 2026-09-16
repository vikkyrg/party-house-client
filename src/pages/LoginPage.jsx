import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await authService.login(data);
      if (response.success) {
        setAuth(response.data.user, response.data.accessToken);
        const returnTo = location.state?.returnTo || '/account/profile';
        if (location.state?.bookingState) {
          navigate(returnTo, { state: location.state.bookingState, replace: true });
        } else {
          navigate(returnTo, { replace: true });
        }
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] py-12">
      <SEO title="Member Login | CS Cinemas" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-6xl"
      >
        <div className="grid md:grid-cols-2 bg-surface shadow-2xl border border-white/5 overflow-hidden min-h-[600px]">
          {/* LEFT: Form Panel */}
          <div className="w-full flex items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-md">
              <Link to="/" className="inline-block mb-12">
                <div className="text-xl font-heading text-white tracking-widest uppercase">
                  CS Cinemas
                </div>
              </Link>
              
              <div className="mb-10">
                <h1 className="text-3xl font-heading text-white mb-2">Welcome back.</h1>
                <p className="text-sm font-sans text-text-muted">Sign in to manage your private screenings.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-[#1B1B1B] border-l-2 border-error text-white text-sm font-sans">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-sans text-text-muted mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full h-12 bg-transparent border-b border-white/20 px-0 text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/20"
                    placeholder="Enter your email"
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-xs text-error font-sans">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-sans text-text-muted">Password</label>
                    <Link to="/forgot-password" className="text-xs font-sans text-text-muted hover:text-white transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    className="w-full h-12 bg-transparent border-b border-white/20 px-0 text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/20"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-2 text-xs text-error font-sans">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-8" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-12 text-center">
                <p className="text-sm font-sans text-text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-white hover:underline underline-offset-4 transition-colors">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Cinematic Image */}
          <div className="hidden lg:block relative bg-[#151515]">
            <img 
              src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=2079&auto=format&fit=crop" 
              alt="Private Cinema" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-80" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
