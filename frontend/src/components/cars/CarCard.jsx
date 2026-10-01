import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Users, Star, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

export const CarCard = ({ car }) => {
  const primaryImage =
    car.images && car.images.length > 0
      ? car.images[0].startsWith('/uploads')
        ? `http://localhost:5000${car.images[0]}`
        : car.images[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 bg-slate-900/60 transition-all duration-300 hover:border-sky-500/40 hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={primaryImage}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Vehicle Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-sky-400">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>{car.vehicleType}</span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {car.isAvailable ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium backdrop-blur-md">
              <CheckCircle2 className="w-3 h-3" /> Available
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-medium backdrop-blur-md">
              <XCircle className="w-3 h-3" /> Reserved
            </span>
          )}
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 text-xs font-semibold text-white border border-slate-800">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{car.ratingsAverage || 4.8}</span>
          <span className="text-slate-400 font-normal">({car.ratingsQuantity || 12})</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-sky-400">
              {car.brand} • {car.year}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors tracking-tight line-clamp-1">
            {car.model}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {car.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-4 my-3 border-y border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{car.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">{car.fuel}</span>
            </div>
          </div>

          {/* Features Preview Pills */}
          {car.features && car.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {car.features.slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                >
                  {feat}
                </span>
              ))}
              {car.features.length > 3 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400">
                  +{car.features.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Per Day</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tracking-tight">${car.pricePerDay}</span>
              <span className="text-xs text-slate-400 font-normal">/ day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/cars/${car._id}`}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors border border-slate-700"
            >
              Details
            </Link>
            <Link
              to={car.isAvailable ? `/book/${car._id}` : '#'}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                car.isAvailable
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
              }`}
              onClick={(e) => !car.isAvailable && e.preventDefault()}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
