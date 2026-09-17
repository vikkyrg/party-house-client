import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data) => {
    if (!phone) {
      setError('Phone number is missing. Please try logging in again.');
      return;
    }

    setError(null);
    try {
      const response = await authService.verifyOtp({ phone, otp: data.otp });
      if (response.success) {
        navigate(location.state?.returnTo || '/');
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF5EB] p-6 font-sans relative overflow-hidden">
      <SEO title="Verify OTP | CS Cinemas" />
      
      <Link 
        to="/login" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] text-[#8c5211] hover:bg-[#8c5211] hover:text-white transition-all z-50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#f0e6dd] rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)]"
      >
        <div className="mb-8 text-center">
          <div className="text-[12px] font-sans font-bold text-[#8c5211] tracking-[0.2em] uppercase mb-3">
            Verification
          </div>
          <h1 className="text-[32px] font-heading font-extrabold text-[#1a1c21] mb-2 leading-tight">Enter OTP Code</h1>
          <p className="text-[14px] font-medium text-[#6b5c52]">
            {phone ? `Enter the 6-digit code sent to ${phone}` : 'Enter your 6-digit OTP code'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#fff1f2] border-l-4 border-[#e11d48] text-[#be123c] rounded-r-xl text-[14px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <input
              type="text"
              maxLength={6}
              className="w-full h-16 bg-[#F9F6F0] border border-[#eaddd0] text-center text-3xl tracking-[0.3em] font-sans text-[#1a1c21] focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-colors rounded-2xl placeholder:text-[#a6998f]"
              placeholder="000000"
              {...register('otp')}
            />
            {errors.otp && <p className="mt-2 text-center text-xs font-medium text-[#e11d48]">{errors.otp.message}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full h-12 bg-[#9e6223] text-white font-bold text-[15px] rounded-xl hover:bg-[#7a4b1b] transition-colors shadow-[0_4px_15px_rgb(158,98,35,0.25)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-[14px] font-bold text-[#8c5211] hover:underline transition-colors">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
