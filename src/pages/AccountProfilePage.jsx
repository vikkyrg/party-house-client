import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/userService';
import { Button } from '../components/common/Button';
import { handleApiError } from '../lib/apiClient';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { SEO } from '../components/common/SEO';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

export function AccountProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    }
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await userService.updateProfile(data);
      if (res.success) {
        setAuth(res.data, useAuthStore.getState().token);
        setSuccessMsg('Profile updated successfully.');
        setIsEditing(false);
      }
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-32 pb-24">
      <SEO title="My Profile | CS Cinemas" />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-12 border-b border-white/10 pb-6">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-text-muted mb-4 block">Account Settings</span>
          <h1 className="text-4xl font-heading text-white">My Profile</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#151515] p-8 border border-white/5 text-center">
              <div className="w-24 h-24 rounded-full bg-[#1B1B1B] border border-white/10 mx-auto flex items-center justify-center mb-6">
                <span className="text-3xl font-heading text-white">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-heading text-white mb-1">{user?.name}</h2>
              <p className="text-sm font-sans text-text-muted mb-6">{user?.email}</p>
              
              <div className="flex items-center justify-center gap-2 text-xs font-sans text-[#A9A39A]">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-[#151515] p-8 md:p-12 border border-white/5">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                <h3 className="text-2xl font-heading text-white">Personal Details</h3>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              {successMsg && (
                <div className="mb-6 p-4 bg-[#1B1B1B] border-l-2 border-success text-white text-sm font-sans">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-[#1B1B1B] border-l-2 border-error text-white text-sm font-sans">
                  {errorMsg}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-sans text-text-muted mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full h-12 bg-[#1B1B1B] border border-white/10 px-4 text-white focus:outline-none focus:border-[#F5F1E8]"
                      {...register('name')}
                    />
                    {errors.name && <p className="mt-2 text-xs text-error font-sans">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-sans text-text-muted mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full h-12 bg-[#1B1B1B] border border-white/10 px-4 text-white focus:outline-none focus:border-[#F5F1E8]"
                      {...register('phone')}
                    />
                    {errors.phone && <p className="mt-2 text-xs text-error font-sans">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-sans text-text-muted mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email} 
                      disabled
                      className="w-full h-12 bg-transparent border border-white/5 px-4 text-white/50 cursor-not-allowed"
                    />
                    <p className="mt-2 text-xs text-text-muted font-sans">Email cannot be changed.</p>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-text-muted mt-1" />
                    <div>
                      <p className="text-xs font-sans text-text-muted uppercase tracking-widest mb-1">Full Name</p>
                      <p className="text-base font-sans text-white">{user?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-text-muted mt-1" />
                    <div>
                      <p className="text-xs font-sans text-text-muted uppercase tracking-widest mb-1">Phone Number</p>
                      <p className="text-base font-sans text-white">{user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-text-muted mt-1" />
                    <div>
                      <p className="text-xs font-sans text-text-muted uppercase tracking-widest mb-1">Email Address</p>
                      <p className="text-base font-sans text-white">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
