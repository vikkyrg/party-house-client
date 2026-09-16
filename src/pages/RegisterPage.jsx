import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <SEO title="Create Account | CS Cinemas" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-6xl"
      >
        <div className="grid md:grid-cols-2 bg-surface shadow-2xl border border-white/5 overflow-hidden min-h-[600px]">
          {/* LEFT: Cinematic Image */}
          <div className="hidden lg:block relative bg-[#151515]">
            <img 
              src="https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=2070&auto=format&fit=crop" 
              alt="Private Cinema Experience" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-80" />
          </div>

          {/* RIGHT: Form Panel */}
          <div className="w-full flex items-center justify-center p-6 md:p-16">
            <div className="w-full max-w-md">
              <Link to="/" className="inline-block mb-12 lg:hidden">
                <div className="text-xl font-heading text-white tracking-widest uppercase">
                  CS Cinemas
                </div>
              </Link>
              
              <div className="mb-10">
                <h1 className="text-3xl font-heading text-white mb-2">Join the premiere.</h1>
                <p className="text-sm font-sans text-text-muted">Create an account to book your private screenings.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-[#1B1B1B] border-l-2 border-error text-white text-sm font-sans">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-sans text-text-muted mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full h-12 bg-transparent border-b border-white/20 px-0 text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/20"
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-2 text-xs text-error font-sans">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-sans text-text-muted mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full h-12 bg-transparent border-b border-white/20 px-0 text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/20"
                    placeholder="john@example.com"
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-xs text-error font-sans">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-sans text-text-muted mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full h-12 bg-transparent border-b border-white/20 px-0 text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/20"
                    placeholder="10-digit mobile number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="mt-2 text-xs text-error font-sans">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-sans text-text-muted mb-2">Password</label>
                  <input 
                    type="password" 
                    className="w-full h-12 bg-transparent border-b border-white/20 px-0 text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/20"
                    placeholder="Create a password"
                    {...register('password')}
                  />
                  {errors.password && <p className="mt-2 text-xs text-error font-sans">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full mt-8" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-12 text-center">
                <p className="text-sm font-sans text-text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white hover:underline underline-offset-4 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
