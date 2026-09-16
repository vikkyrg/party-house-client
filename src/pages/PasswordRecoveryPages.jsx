import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { motion } from 'framer-motion';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      if (response.success) {
        setSubmitted(true);
        toast.success('Password reset link sent!');
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      <SEO title="Forgot Password | CS Cinemas" />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-3xl max-w-md w-full relative z-10 border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent" />

        <h1 className="text-3xl font-black text-white font-heading tracking-tight mb-2">Reset Password</h1>
        
        {submitted ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-success/80 to-success text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg shadow-success/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-text-muted text-lg">
              We've sent a password reset link to <strong className="text-white">{email}</strong>. Please check your inbox.
            </p>
            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setSubmitted(false)}>
              Try another email
            </Button>
          </div>
        ) : (
          <>
            <p className="text-text-muted mb-8 leading-relaxed">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className={`absolute left-4 px-1 transition-all duration-200 pointer-events-none bg-surface/80 backdrop-blur-sm ${focused || email ? '-top-2.5 text-xs text-primary font-semibold' : 'top-3.5 text-sm text-text-muted'}`}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full h-14 rounded-2xl bg-[#0a0a0c] border border-white/10 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-14 font-bold rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.25)] hover:shadow-[0_15px_40px_rgba(0,229,255,0.4)]" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            <div className="mt-8 text-center text-sm text-text-muted">
              Remember your password? <Link to="/login" className="text-white hover:text-primary font-bold transition-colors">Log in</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authService.resetPassword({ token, password });
      if (response.success) {
        toast.success('Password successfully reset! You can now log in.');
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      <SEO title="Reset Password | CS Cinemas" />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-3xl max-w-md w-full relative z-10 border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent" />

        <h1 className="text-3xl font-black text-white font-heading tracking-tight mb-2">Create New Password</h1>
        <p className="text-text-muted mb-8 leading-relaxed">Please enter your new password below.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className={`absolute left-4 px-1 transition-all duration-200 pointer-events-none bg-surface/80 backdrop-blur-sm ${focused1 || password ? '-top-2.5 text-xs text-primary font-semibold' : 'top-3.5 text-sm text-text-muted'}`}>
              New Password
            </label>
            <input 
              type="password" 
              className="w-full h-14 rounded-2xl bg-[#0a0a0c] border border-white/10 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onFocus={() => setFocused1(true)}
              onBlur={() => setFocused1(false)}
              required
            />
          </div>
          <div className="relative">
            <label className={`absolute left-4 px-1 transition-all duration-200 pointer-events-none bg-surface/80 backdrop-blur-sm ${focused2 || confirmPassword ? '-top-2.5 text-xs text-primary font-semibold' : 'top-3.5 text-sm text-text-muted'}`}>
              Confirm Password
            </label>
            <input 
              type="password" 
              className="w-full h-14 rounded-2xl bg-[#0a0a0c] border border-white/10 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused2(true)}
              onBlur={() => setFocused2(false)}
              required
            />
          </div>
          <Button type="submit" className="w-full h-14 font-bold rounded-2xl shadow-[0_10px_30px_rgba(0,229,255,0.25)] hover:shadow-[0_15px_40px_rgba(0,229,255,0.4)]" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
