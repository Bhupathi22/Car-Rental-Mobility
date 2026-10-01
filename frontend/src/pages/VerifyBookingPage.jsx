import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsApi } from '../services/api';
import { BackButton } from '../components/common/BackButton';
import { CheckCircle2, ShieldCheck, Car, Calendar, User, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const VerifyBookingPage = () => {
  const { identifier } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performVerification = async () => {
      try {
        const res = await bookingsApi.verify(identifier);
        setData(res.data.data);
        toast.success('Booking successfully verified! Vehicle approved for release.');
      } catch (err) {
        setError(err.message || 'Verification token could not be matched in database.');
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      performVerification();
    }
  }, [identifier]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <BackButton to="/bookings" label="Back to Bookings" />

      {loading ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Validating QR Token with MongoDB...</h2>
          <p className="text-xs text-slate-400">Verifying signature and vehicle availability state.</p>
        </div>
      ) : error ? (
        <div className="glass-panel p-10 rounded-3xl border border-rose-500/30 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Verification Failed</h2>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs">
            Return to Homepage
          </Link>
        </div>
      ) : (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-8 text-center">
          {/* Success Check Badge */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              PHYSICAL QR DISPATCH VERIFIED
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1 uppercase tracking-tight">
              BOOKING VERIFICATION
            </h1>
            <p className="text-sm font-semibold text-emerald-300 mt-2">
              "Booking successfully verified!"
            </p>
          </div>

          {/* Verification Checklist */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-3.5 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>✓ <strong>Booking Found</strong> in MongoDB ({data.bookingCode})</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>✓ <strong>Customer Verified:</strong> {data.customerName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>✓ <strong>Vehicle Verified:</strong> {data.vehicleBrand} {data.vehicleModel}</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>✓ <strong>Booking Confirmed</strong> &amp; Payment Status: {data.paymentStatus.toUpperCase()}</span>
            </div>
          </div>

          {/* Booking Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Pickup Hub
              </span>
              <p className="text-white font-medium">{data.pickupLocation}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-sky-400" /> Return Scheduled
              </span>
              <p className="text-white font-medium">{new Date(data.returnDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-800">
            <Link
              to={`/tracking?booking=${data.bookingId}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              Open Live GPS Telemetry
            </Link>
            <Link
              to="/bookings"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
