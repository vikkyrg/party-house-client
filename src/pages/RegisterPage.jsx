import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-[#FCF5EB] py-12 font-sans relative overflow-hidden">
      <SEO title="Create Account | CS Cinemas" />
      
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] text-[#8c5211] hover:bg-[#8c5211] hover:text-white transition-all z-50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-6 max-w-6xl relative z-10"
      >
        <div className="grid md:grid-cols-2 bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-[#f0e6dd] overflow-hidden min-h-[650px]">
          {/* LEFT: Cinematic Image */}
          <div className="hidden md:block relative">
            <img 
              src="/event_friends.jpg" 
              alt="Private Cinema Experience" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* RIGHT: Form Panel */}
          <div className="w-full flex items-center justify-center p-8 md:p-16">
            <div className="w-full max-w-md">
              <Link to="/" className="inline-block mb-10 md:hidden">
                <div className="text-[12px] font-sans font-bold text-[#8c5211] tracking-[0.2em] uppercase">
                  CS Cinemas
                </div>
              </Link>
              
              <div className="mb-10">
                <h1 className="text-[32px] md:text-[40px] font-heading text-[#1a1c21] font-extrabold mb-2 leading-tight">Join the premiere.</h1>
                <p className="text-[15px] font-medium text-[#6b5c52]">Create an account to book your private screenings.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-[#fff1f2] border-l-4 border-[#e11d48] text-[#be123c] rounded-r-xl text-[14px] font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  {errors.name && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                    placeholder="john@example.com"
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                    placeholder="10-digit mobile number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 pr-12 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                      placeholder="Create a password"
                      {...register('password')}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a6998f] hover:text-[#8c5211] transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.password.message}</p>}
                </div>

                <button 
                  type="submit" 
                  className="w-full h-12 mt-8 bg-[#9e6223] text-white font-bold text-[15px] rounded-xl hover:bg-[#7a4b1b] transition-colors shadow-[0_4px_15px_rgb(158,98,35,0.25)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-[14px] font-medium text-[#6b5c52]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#8c5211] font-bold hover:underline underline-offset-4 transition-colors">
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
