import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import {
  Car,
  Users,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  ArrowRight,
  PieChart,
  BarChart3,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.getDashboard();
        setData(res.data.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-900/60 rounded-3xl animate-pulse" />
          <div className="h-80 bg-slate-900/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const { kpis, charts, recentBookings, recentActivities } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Fleet Operations Control Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Admin Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated in real-time through MongoDB aggregation pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/cars"
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            Manage Fleet Cars
          </Link>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Review Bookings
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Section 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Cars */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Cars</span>
            <Car className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">{kpis?.totalCars || 0}</span>
          <span className="text-[10px] text-slate-500 block">Fleet size in MongoDB</span>
        </div>

        {/* Available Cars */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Available Cars</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">{kpis?.availableCars || 0}</span>
          <span className="text-[10px] text-slate-500 block">Ready for customer booking</span>
        </div>

        {/* Total Customers */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">{kpis?.totalCustomers || 0}</span>
          <span className="text-[10px] text-slate-500 block">Registered customer users</span>
        </div>

        {/* Active Bookings */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Bookings</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">{kpis?.activeBookings || 0}</span>
          <span className="text-[10px] text-slate-500 block">Ongoing &amp; confirmed</span>
        </div>

        {/* Completed Bookings */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">{kpis?.completedBookings || 0}</span>
          <span className="text-[10px] text-slate-500 block">Successfully returned</span>
        </div>

        {/* Total Revenue */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            ${kpis?.totalRevenue?.toFixed(0) || 0}
          </span>
          <span className="text-[10px] text-slate-500 block">Aggregated payments</span>
        </div>
      </div>

      {/* Analytics Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings & Revenue Visual Bar Chart */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" /> Monthly Bookings &amp; Revenue
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">MongoDB $group aggregation by year and month</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-400 font-mono">
              $sum: '$totalAmount'
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {charts?.monthlyMetrics?.map((m, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-semibold text-white">{m.month}</span>
                  <span className="font-mono text-emerald-400 font-bold">${m.revenue.toLocaleString()} ({m.bookings} trips)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, (m.revenue / 10000) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Distribution by Vehicle Class */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" /> Fleet Category Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across luxury, electric, and SUV classes</p>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
              $group: '$vehicleType'
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {charts?.categoryDistribution?.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block text-[11px]">{cat.category}</span>
                <span className="text-2xl font-black text-white block">{cat.count} <span className="text-xs font-normal text-slate-400">units</span></span>
                <span className="text-[10px] text-sky-400 block font-mono">Avg ${cat.avgPrice}/day</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Recent Bookings Table */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Recent Fleet Bookings</h3>
            <Link to="/admin/bookings" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings?.map((b) => (
              <div key={b._id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-sky-400 font-bold">{b.bookingCode}</span>
                  <h4 className="font-bold text-white">{b.vehicleInfo?.brand} {b.vehicleInfo?.model}</h4>
                  <span className="text-slate-400 text-[11px]">{b.customerInfo?.name} • {b.numberOfDays} days</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white block">${b.totalAmount}</span>
                  <span className={`text-[10px] font-bold uppercase ${b.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {b.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs Audit Trail (CO6 Observability) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Platform Activity Logs
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">ActivityLog Collection</span>
          </div>

          <div className="space-y-2.5">
            {recentActivities?.map((act) => (
              <div key={act._id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sky-400 font-bold">{act.action}</span>
                  <span className="text-slate-500 font-mono">{new Date(act.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300">
                  User: <strong className="text-white">{act.userEmail}</strong> • Module: <span className="text-emerald-400">{act.module}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
