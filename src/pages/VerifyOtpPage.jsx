import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';

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
        navigate('/');
      }
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
      <SEO title="Verify OTP | CS Cinemas" />
      
      <div className="w-full max-w-md bg-[#151515] border border-white/5 p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading text-white mb-2">Verification</h1>
          <p className="text-sm font-sans text-text-muted">
            {phone ? `Enter the 6-digit code sent to ${phone}` : 'Enter your 6-digit OTP code'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#1B1B1B] border-l-2 border-error text-white text-sm font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <input
              type="text"
              maxLength={6}
              className="w-full h-16 bg-transparent border-b border-white/20 text-center text-3xl tracking-[0.3em] font-sans text-white focus:outline-none focus:border-[#F5F1E8] transition-colors rounded-none placeholder:text-white/10"
              placeholder="000000"
              {...register('otp')}
            />
            {errors.otp && <p className="mt-2 text-center text-xs font-sans text-error">{errors.otp.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>

        <div className="mt-10 text-center">
          <Link to="/login" className="text-sm font-sans text-text-muted hover:text-white transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
