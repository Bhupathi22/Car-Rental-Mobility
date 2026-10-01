import React, { useState, useEffect } from 'react';
import { bookingsApi } from '../services/api';
import { BackButton } from '../components/common/BackButton';
import { QRModal } from '../components/bookings/QRModal';
import { Calendar, QrCode, Search, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBookingForQR, setSelectedBookingForQR] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingsApi.getAllBookings({ status: statusFilter || undefined });
      setBookings(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/admin" label="Back to Dashboard" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            Fleet Operations
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            All Customer Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global booking registry across all customers with live verification QR inspection.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Bookings</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Booking Code</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6">Dates &amp; Hub</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">QR Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-2" />
                    Querying bookings from MongoDB...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No bookings found matching selected filter.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-sky-400">
                      {b.bookingCode}
                    </td>

                    <td className="py-4 px-6">
                      <strong className="text-white block">{b.customerInfo?.name}</strong>
                      <span className="text-[11px] text-slate-400">{b.customerInfo?.email}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-white block">
                        {b.vehicleInfo?.brand} {b.vehicleInfo?.model}
                      </span>
                      <span className="text-[11px] text-slate-400">{b.vehicleInfo?.year}</span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-slate-200">
                        {new Date(b.pickupDate).toLocaleDateString()} →{' '}
                        {new Date(b.returnDate).toLocaleDateString()}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                        {b.pickupLocation?.name?.split(',')[0]}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-white block">${b.totalAmount}</span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          b.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
                          b.bookingStatus === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedBookingForQR(b)}
                        className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors border border-sky-500/20"
                        title="View Verification QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QRModal
        isOpen={!!selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
        booking={selectedBookingForQR}
      />
    </div>
  );
};
