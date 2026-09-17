import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/userService';
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
    <div className="min-h-screen bg-[#FCF5EB] pt-32 pb-24 font-sans relative overflow-hidden">
      <SEO title="My Profile | CS Cinemas" />
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] pointer-events-none opacity-60" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative z-10">
        <div className="mb-12 border-b border-[#eaddd0] pb-6 text-center md:text-left">
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#8c5211] mb-2 block">Account Settings</span>
          <h1 className="text-[40px] font-heading text-[#1a1c21] font-extrabold">My Profile</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[24px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd] text-center">
              <div className="w-24 h-24 rounded-full bg-[#f4e6d9] border border-[#eaddd0] mx-auto flex items-center justify-center mb-6 shadow-inner">
                <span className="text-3xl font-heading font-black text-[#8c5211]">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-[#1a1c21] mb-1">{user?.name}</h2>
              <p className="text-[14px] font-medium text-[#6b5c52] mb-6">{user?.email}</p>
              
              <div className="flex items-center justify-center gap-2 text-[12px] font-bold text-[#8c5211] bg-[#FCF5EB] py-2 px-4 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-[#f0e6dd]">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#eaddd0]">
                <h3 className="text-2xl font-heading font-bold text-[#1a1c21]">Personal Details</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 text-[13px] font-bold bg-[#F9F6F0] text-[#8c5211] border border-[#eaddd0] rounded-full hover:bg-[#8c5211] hover:text-white transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="mb-6 p-4 bg-[#ecfdf5] border-l-4 border-[#10b981] text-[#047857] rounded-r-xl text-[14px] font-medium">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-[#fff1f2] border-l-4 border-[#e11d48] text-[#be123c] rounded-r-xl text-[14px] font-medium">
                  {errorMsg}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                      {...register('name')}
                    />
                    {errors.name && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full h-12 bg-[#F9F6F0] border border-[#eaddd0] px-4 text-[#1a1c21] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8c5211]/20 focus:border-[#8c5211] transition-all placeholder:text-[#a6998f] text-[15px] font-medium"
                      {...register('phone')}
                    />
                    {errors.phone && <p className="mt-2 text-xs text-[#e11d48] font-medium">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-[#1a1c21] mb-2 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email} 
                      disabled
                      className="w-full h-12 bg-[#F9F6F0]/50 border border-[#eaddd0]/50 px-4 text-[#6b5c52] rounded-xl cursor-not-allowed font-medium"
                    />
                    <p className="mt-2 text-[12px] font-medium text-[#a6998f]">Email cannot be changed.</p>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-[#eaddd0] mt-8">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="h-11 px-6 bg-[#9e6223] text-white font-bold text-[14px] rounded-full hover:bg-[#7a4b1b] transition-colors shadow-[0_4px_15px_rgb(158,98,35,0.2)] disabled:opacity-70"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="h-11 px-6 bg-white border border-[#eaddd0] text-[#6b5c52] font-bold text-[14px] rounded-full hover:bg-[#F9F6F0] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-start gap-4 p-4 rounded-[16px] hover:bg-[#FCF5EB] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f4e6d9] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#8c5211]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#8c5211] uppercase tracking-[0.15em] mb-1">Full Name</p>
                      <p className="text-[16px] font-bold text-[#1a1c21]">{user?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-[16px] hover:bg-[#FCF5EB] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f4e6d9] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#8c5211]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#8c5211] uppercase tracking-[0.15em] mb-1">Phone Number</p>
                      <p className="text-[16px] font-bold text-[#1a1c21]">{user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-[16px] hover:bg-[#FCF5EB] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#f4e6d9] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#8c5211]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#8c5211] uppercase tracking-[0.15em] mb-1">Email Address</p>
                      <p className="text-[16px] font-bold text-[#1a1c21]">{user?.email}</p>
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
