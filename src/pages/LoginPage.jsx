import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-[#FCF5EB] py-12 font-sans relative overflow-hidden">
      <SEO title="Member Login | CS Cinemas" />
      
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
          {/* LEFT: Form Panel */}
          <div className="w-full flex items-center justify-center p-8 md:p-16">
            <div className="w-full max-w-md">
              <Link to="/" className="inline-block mb-10">
                <div className="text-[12px] font-sans font-bold text-[#8c5211] tracking-[0.2em] uppercase">
                  CS Cinemas
                </div>
              </Link>
              
              <div className="mb-10">
                <h1 className="text-[32px] md:text-[40px] font-heading text-[#1a1c21] font-extrabold mb-2 leading-tight">Welcome back.</h1>
                <p className="text-[15px] font-medium text-[#6b5c52]">Sign in to manage your private screenings.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-[#fff1f2] border-l-4 border-[#e11d48] text-[#be123c] rounded-r-xl text-[14px] font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                    placeholder="Enter your email"
                    {...register('email')}
                  />
                  {errors.email && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[13px] font-bold text-[#1a1c21] uppercase tracking-wide">Password</label>
                    <Link to="/forgot-password" className="text-[12px] font-bold text-[#8c5211] hover:text-[#9e6223] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 pr-12 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                      placeholder="Enter your password"
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
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-[14px] font-medium text-[#6b5c52]">
                  Don't have an account?{' '}
                  <Link to="/register" state={location.state} className="text-[#8c5211] font-bold hover:underline underline-offset-4 transition-colors">
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Cinematic Image */}
          <div className="hidden md:block relative">
            <img 
              src="/event_romantic.jpg" 
              alt="Private Cinema" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
