import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BackButton } from '../components/common/BackButton';
import { User, Mail, Phone, MapPin, Shield, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(formData);
    } catch (err) {
      // toast shown in context
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/" label="Back to Home" />

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          Account Settings
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
          Customer Profile &amp; Preferences
        </h1>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-500/40"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-semibold text-sky-400">
              <Shield className="w-3.5 h-3.5" />
              <span>{user?.role} ACCOUNT</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs max-w-xl">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Home Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
            >
              {saving ? 'Updating MongoDB...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
