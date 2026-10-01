import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QRModal } from '../components/bookings/QRModal';
import { BackButton } from '../components/common/BackButton';
import {
  Calendar,
  MapPin,
  QrCode,
  Navigation,
  CreditCard,
  Ban,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForQR, setSelectedBookingForQR] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await bookingsApi.getMyBookings();
      setBookings(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking reservation?')) return;
    setCancellingId(id);
    try {
      await bookingsApi.cancel(id, 'Cancelled by customer');
      toast.success('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/" label="Back to Home" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            My Travel Itinerary
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Active &amp; Past Bookings
          </h1>
        </div>
        <Link
          to="/cars"
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
        >
          Book Another Vehicle
        </Link>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Reservations Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't reserved any vehicles yet. Explore our luxury and electric fleet to begin your journey.
          </p>
          <Link
            to="/cars"
            className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25"
          >
            Explore Vehicles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';
            const isPaid = booking.paymentStatus === 'paid';

            return (
              <div
                key={booking._id}
                className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Vehicle and Metadata */}
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full lg:w-auto">
                  <img
                    src={booking.vehicleInfo?.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                    alt={booking.vehicleInfo?.model}
                    className="w-full sm:w-36 h-24 rounded-2xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        {booking.bookingCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${
                          isCancelled
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : booking.bookingStatus === 'confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          isPaid ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {booking.vehicleInfo?.brand} {booking.vehicleInfo?.model} ({booking.vehicleInfo?.year})
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-400" />
                        {new Date(booking.pickupDate).toLocaleDateString()} →{' '}
                        {new Date(booking.returnDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{booking.numberOfDays} days</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        {booking.pickupLocation?.name?.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Rate</span>
                    <span className="text-2xl font-black text-white font-mono">
                      ${booking.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View QR Code */}
                    <button
                      onClick={() => setSelectedBookingForQR(booking)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" /> View QR
                    </button>

                    {/* Pay if unpaid */}
                    {!isPaid && !isCancelled && (
                      <Link
                        to={`/payment/${booking._id}`}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Complete Payment
                      </Link>
                    )}

                    {/* Live Tracking */}
                    {!isCancelled && (
                      <Link
                        to={`/tracking?booking=${booking._id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-sky-400" /> Track Vehicle
                      </Link>
                    )}

                    {/* Cancel button */}
                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-rose-500/20"
                      >
                        <Ban className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Pass Modal */}
      <QRModal
        isOpen={!!selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
        booking={selectedBookingForQR}
      />
    </div>
  );
};
