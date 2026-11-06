import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';
import { useBookingModalStore } from '../store/bookingModalStore';
import { SEO } from '../components/common/SEO';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const trimmedIdentifier = identifier.trim();
    const credentials = trimmedIdentifier.includes('@')
      ? { email: trimmedIdentifier.toLowerCase(), password }
      : { phone: trimmedIdentifier.replace(/[\s\-()]/g, ''), password };

    try {
      const response = await authService.login(credentials);
      useBookingModalStore.getState().clearActiveBooking();
      window.sessionStorage.removeItem('rio-active-booking-id');
      const currentDraftId = window.sessionStorage.getItem('rio-current-draft-id');
      if (currentDraftId) window.sessionStorage.removeItem(`booking-hold:${currentDraftId}`);
      window.sessionStorage.removeItem('rio-current-draft-id');
      setAuth(response.data.user, response.data.accessToken);
      navigate(location.state?.from || '/', { replace: true });
    } catch (loginError) {
      setError(handleApiError(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-background px-4 py-28">
      <SEO title="Customer Login | RIO PARTY HOUSE" />
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#15141b] p-8 shadow-2xl">
        <p className="eyebrow mb-3">Customer account</p>
        <h1 className="text-3xl font-black text-white">Sign in</h1>
        <p className="mt-2 text-sm text-text-muted">Sign in to keep your bookings associated with your account.</p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-white">
            Email or mobile number
            <input
              autoComplete="username"
              required
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm font-semibold text-white">
            Password
            <input
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary"
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-6 py-3 font-bold text-black transition hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          New to Rio? <Link to="/theaters" className="font-semibold text-primary hover:underline">Browse theaters</Link>
        </p>
      </div>
    </section>
  );
}
