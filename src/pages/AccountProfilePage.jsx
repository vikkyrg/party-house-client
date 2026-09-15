import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { handleApiError } from '../lib/apiClient';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export function AccountProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      if (response.success) {
        setAuth(response.data.user, useAuthStore.getState().accessToken);
        toast.success('Profile updated successfully', {
          style: { background: '#18181b', color: '#fff', border: '1px solid rgba(234, 179, 8, 0.3)' }
        });
      }
    } catch (error) {
      toast.error(handleApiError(error), {
        style: { background: '#18181b', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20 pt-28 relative overflow-hidden">
      <SEO title="My Profile | CS Cinemas" />

      <div className="absolute right-0 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="eyebrow mb-4">Account</span>
          <h1 className="text-3xl md:text-5xl font-black text-white font-heading tracking-tight">My Profile</h1>
          <p className="mt-3 text-lg text-text-muted">Manage your personal information and booking preferences.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-[30px] border border-white/10 bg-[#141519] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:p-10">
          <div className="mb-10 flex items-center gap-6 border-b border-white/10 pb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-3xl font-bold text-black shadow-[0_14px_34px_rgba(214,168,79,0.28)]">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-heading">{user.name}</h2>
              <p className="text-primary font-medium">{user.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/90">
                <User className="h-4 w-4 text-primary" /> Full Name
              </label>
              <input value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} required className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" placeholder="John Doe" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Phone className="h-4 w-4 text-primary" /> Phone Number
                </label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} required className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" placeholder="10-digit mobile number" />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Mail className="h-4 w-4 text-primary" /> Email Address
                </label>
                <input type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className="h-12 w-full rounded-2xl border border-white/10 bg-[#101014] px-4 text-white outline-none transition focus:border-primary/50" placeholder="your@email.com" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Shield className="h-4 w-4" /> Your data is secure
              </div>

              <Button type="submit" disabled={loading} className="h-12 rounded-xl px-8 font-bold shadow-[0_14px_30px_rgba(214,168,79,0.2)]">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
