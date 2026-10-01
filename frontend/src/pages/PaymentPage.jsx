import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsApi, paymentsApi } from '../services/api';
import { BackButton } from '../components/common/BackButton';
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, AlertCircle, Smartphone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'card' | 'upi'

  // Card details state
  const [cardData, setCardData] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: 'Alex Johnson',
    expiry: '12/28',
    cvv: '982',
  });

  // UPI details state
  const [upiId, setUpiId] = useState('alex@okaxis');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingsApi.getById(bookingId);
        setBooking(res.data.data);
      } catch (err) {
        toast.error(err.message || 'Booking not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleProcessPayment = async (method) => {
    setProcessing(true);
    try {
      const payload = {
        bookingId: booking._id,
        amount: booking.totalAmount,
        paymentMethod: method === 'card' ? 'demo_card' : method === 'upi' ? 'demo_upi' : 'demo_wallet',
        cardDetails: method === 'card' ? cardData : null,
        upiId: method === 'upi' ? upiId : null,
      };

      const res = await paymentsApi.create(payload);
      toast.success('Payment authorized and recorded in MongoDB! Booking confirmed.');

      // Navigate to customer bookings list or verification view
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Initializing secure payment gateway...</p>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <BackButton to="/bookings" label="Back to Bookings" />

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          Checkout Gateway
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Secure Payment Settlement
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete payment to confirm vehicle dispatch and activate your QR verification token in MongoDB.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Payment Gateway Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('demo')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'demo'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Demo One-Click
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'card'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Credit / Debit
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'upi'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> Instant UPI
              </button>
            </div>

            {/* TAB 1: ONE CLICK DEMO */}
            {activeTab === 'demo' && (
              <div className="space-y-4 p-5 rounded-2xl bg-sky-950/20 border border-sky-500/20 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Academic Demo Sandbox Checkout</h4>
                    <p className="text-slate-400 text-[11px]">
                      Zero real charges. Generates real transactionId and persists payment record to MongoDB.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                  <p>• Verified Customer: <strong className="text-white">{booking.customerInfo?.name}</strong></p>
                  <p>• Associated Booking ID: <span className="font-mono text-sky-400">{booking._id}</span></p>
                  <p>• Transaction Reference: <span className="font-mono text-emerald-400">TXN-DEMO-PERSISTED</span></p>
                </div>

                <button
                  onClick={() => handleProcessPayment('demo')}
                  disabled={processing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {processing ? 'Persisting Payment to MongoDB...' : `Authorize $${booking.totalAmount.toFixed(2)} Demo Payment`}
                </button>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD UI */}
            {activeTab === 'card' && (
              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="font-mono tracking-widest text-[11px]">CAR RENTAL MOBILITY PASS</span>
                    <span className="text-sm font-black text-sky-400">VISA / MC</span>
                  </div>
                  <div className="text-lg font-mono text-white tracking-widest py-2">
                    {cardData.cardNumber}
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <div>
                      <span className="block uppercase text-slate-500">Card Holder</span>
                      <span className="font-semibold text-white">{cardData.cardHolder}</span>
                    </div>
                    <div>
                      <span className="block uppercase text-slate-500">Expires</span>
                      <span className="font-semibold text-white">{cardData.expiry}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength="4"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleProcessPayment('card')}
                  disabled={processing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {processing ? 'Processing Card...' : `Pay $${booking.totalAmount.toFixed(2)} with Card`}
                </button>
              </div>
            )}

            {/* TAB 3: UPI UI */}
            {activeTab === 'upi' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-semibold">Enter VPA / UPI ID</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-xl"
                    >
                      Verify
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">Supports Google Pay, PhonePe, Paytm, and BHIM UPI protocols.</p>
                </div>

                <button
                  onClick={() => handleProcessPayment('upi')}
                  disabled={processing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {processing ? 'Sending UPI Request...' : `Complete $${booking.totalAmount.toFixed(2)} UPI Payment`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Payment Summary</h3>

            {/* Car Details */}
            <div className="flex gap-4 items-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <img
                src={booking.vehicleInfo?.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                alt={booking.vehicleInfo?.model}
                className="w-20 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  {booking.vehicleInfo?.brand} • {booking.vehicleInfo?.year}
                </span>
                <h4 className="font-bold text-white text-sm truncate">{booking.vehicleInfo?.model}</h4>
                <span className="text-xs text-slate-400">{booking.vehicleInfo?.vehicleType}</span>
              </div>
            </div>

            {/* Dates and Duration */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-white">{booking.numberOfDays} Day(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Date:</span>
                <span className="text-white">{new Date(booking.pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Return Date:</span>
                <span className="text-white">{new Date(booking.returnDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Detailed Cost Breakdown */}
            <div className="space-y-2.5 text-xs pt-3 border-t border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span>Base Rental Price</span>
                <span className="font-bold text-white">${booking.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobility Taxes (8%)</span>
                <span className="font-bold text-white">${booking.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fleet Preparation &amp; Service Fee</span>
                <span className="font-bold text-white">${booking.serviceFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Total Payable
                </span>
                <span className="text-xs text-emerald-400 font-medium">100% Guaranteed Rate</span>
              </div>
              <span className="text-3xl font-black text-white font-mono">${booking.totalAmount.toFixed(2)}</span>
            </div>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 256-Bit Encrypted Academic Settlement Architecture</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
