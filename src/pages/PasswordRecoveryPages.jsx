import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { useSearchParams } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    <div className="container mx-auto px-4 py-16 min-h-[70vh] flex items-center justify-center">
      <div className="glass-card p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
        
        {submitted ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            <p className="text-text-muted">
              We've sent a password reset link to <strong className="text-white">{email}</strong>. Please check your inbox.
            </p>
            <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
              Try another email
            </Button>
          </div>
        ) : (
          <>
            <p className="text-text-muted mb-8">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-text-muted">
              Remember your password? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="container mx-auto px-4 py-16 min-h-[70vh] flex items-center justify-center">
      <div className="glass-card p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
        <p className="text-text-muted mb-8">Please enter your new password below.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <Input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>
          <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
