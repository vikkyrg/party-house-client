import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Loader2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';

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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#151518] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Film className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-white">Verify OTP</h1>
          <p className="mt-2 text-sm text-text-muted">
            {phone ? `Enter the code sent to ${phone}` : 'Enter your 6-digit OTP code'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-error/20 bg-error/10 p-4 text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">OTP Code</label>
            <Input
              type="text"
              maxLength={6}
              placeholder="123456"
              className="h-12 rounded-2xl border border-white/10 bg-[#101014] text-center text-lg tracking-[0.45em] font-mono text-white"
              {...register('otp')}
            />
            {errors.otp && <p className="mt-2 text-center text-sm text-error">{errors.otp.message}</p>}
          </div>

          <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
      </div>
    </div>
  );
}
