import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { BackButton } from '../components/common/BackButton';
import { Users, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await adminApi.getCustomers();
        setCustomers(res.data.data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch customer directory');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/admin" label="Back to Dashboard" />

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          User Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Registered Customers
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered customer accounts stored in the MongoDB `users` collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))
        ) : customers.length === 0 ? (
          <div className="col-span-full glass-panel p-8 rounded-2xl text-center text-slate-400">
            No registered customer accounts found.
          </div>
        ) : (
          customers.map((c) => (
            <div key={c._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-3.5">
                <img
                  src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt={c.name}
                  className="w-12 h-12 rounded-xl object-cover border border-sky-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{c.name}</h3>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px] truncate">
                    <Mail className="w-3 h-3 text-sky-400" /> {c.email}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400" /> {c.phone || 'N/A'}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" /> {c.address || 'N/A'}
                </p>
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Joined {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
