import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { SEO } from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      if (response.success) {
        setStep(2);
        toast.success('OTP sent to your email!');
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authService.resetPassword({ email, otp, password });
      if (response.success) {
        toast.success('Password reset successfully! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF5EB] py-12 font-sans relative overflow-hidden">
      <SEO title="Reset Password | CS Cinemas" />
      
      <Link 
        to="/login" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] text-[#8c5211] hover:bg-[#8c5211] hover:text-white transition-all z-50 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] px-4 z-10"
      >
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-[#f0e6dd] relative overflow-hidden min-h-[450px] flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-[32px] font-heading font-extrabold text-[#1a1c21] tracking-tight mb-3">
                    Forgot Password?
                  </h1>
                  <p className="text-[15px] font-medium text-[#6b5c52]">
                    No worries! Enter your email address and we will send you an OTP to reset your password.
                  </p>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-[#9e6223] hover:bg-[#8c5211] text-white text-[15px] font-bold rounded-xl transition-colors disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-[14px] font-medium text-[#6b5c52]">
                    Remember your password?{' '}
                    <Link to="/login" className="text-[#8c5211] font-bold hover:underline">
                      Log In
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-[32px] font-heading font-extrabold text-[#1a1c21] tracking-tight mb-3">
                    Reset Password
                  </h1>
                  <p className="text-[15px] font-medium text-[#6b5c52]">
                    We've sent an OTP to <strong className="text-[#1a1c21]">{email}</strong>. Please enter it below along with your new password.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">6-Digit OTP</label>
                    <input 
                      type="text"
                      maxLength={6}
                      className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium text-center tracking-[0.5em]"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">New Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 pr-12 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                        placeholder="Create new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a6998f] hover:text-[#8c5211] transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Confirm Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirm ? 'text' : 'password'}
                        className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 pr-12 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a6998f] hover:text-[#8c5211] transition-colors focus:outline-none"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-[#9e6223] hover:bg-[#8c5211] text-white text-[15px] font-bold rounded-xl transition-colors disabled:opacity-70 mt-2"
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setStep(1)}
                    className="text-[14px] font-bold text-[#8c5211] hover:underline"
                  >
                    Back to email input
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}

// Dummy export to keep the router from breaking if it imports this.
// In the new flow, we don't use this route because it's all handled in ForgotPasswordPage.
export function ResetPasswordPage() {
  const navigate = useNavigate();
  import('react').then(({ useEffect }) => {
    useEffect(() => {
      navigate('/forgot-password', { replace: true });
    }, [navigate]);
  });
  return null;
}
