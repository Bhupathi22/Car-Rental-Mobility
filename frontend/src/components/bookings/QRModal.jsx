import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QRModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const verificationUrl = `${window.location.origin}/verify-booking/${booking._id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-sky-500/30 shadow-2xl p-6 sm:p-8 text-center relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-sky-400" />
        </div>

        <h3 className="text-xl font-extrabold text-white">Digital Check-In QR Pass</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Scan this at the pickup hub or tap Verify to complete vehicle dispatch.
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-5 rounded-2xl inline-block shadow-xl border-4 border-slate-900 mx-auto">
          {booking.qrCodeString && booking.qrCodeString.startsWith('data:image') ? (
            <img
              src={booking.qrCodeString}
              alt="Verification QR Code"
              className="w-48 h-48 mx-auto"
            />
          ) : (
            <QRCodeSVG
              value={verificationUrl}
              size={192}
              level="H"
              includeMargin={false}
            />
          )}
        </div>

        {/* Booking Reference Details */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Booking Code:</span>
            <span className="font-mono font-bold text-sky-400">{booking.bookingCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Vehicle:</span>
            <span className="font-semibold text-white">
              {booking.vehicleInfo?.brand} {booking.vehicleInfo?.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="capitalize font-semibold text-emerald-400">
              {booking.bookingStatus} • {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* Action to simulate QR scan directly */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link
            to={`/verify-booking/${booking._id}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
          >
            <CheckCircle className="w-4 h-4" /> Simulate Scan / Verify
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
