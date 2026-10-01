import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BackButton } from '../components/common/BackButton';
import LocationPicker from '../components/common/LocationPicker';
import {
  Calendar,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // BOOKING FORM STATE
  // ============================================================

  const tomorrow = new Date(Date.now() + 86400000)
    .toISOString()
    .split('T')[0];

  const fourDaysLater = new Date(Date.now() + 86400000 * 4)
    .toISOString()
    .split('T')[0];

  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState(fourDaysLater);

  // Default map center: Hyderabad
  // These are only the initial map coordinates.
  // The user can select the actual pickup/drop location.
  const [pickupLocation, setPickupLocation] = useState({
    name: 'Select pickup location',
    latitude: 17.3850,
    longitude: 78.4867,
  });

  const [dropLocation, setDropLocation] = useState({
    name: 'Select drop-off location',
    latitude: 17.3850,
    longitude: 78.4867,
  });

  const [phone, setPhone] = useState(
    user?.phone || '+1 (555) 019-2834'
  );

  // ============================================================
  // LOAD SELECTED CAR
  // ============================================================

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await carsApi.getById(carId);

        const loadedCar = res.data.data;

        setCar(loadedCar);

        // If the selected car already has saved locations,
        // use those locations as the initial booking locations.
        if (loadedCar.pickupLocation) {
          setPickupLocation(loadedCar.pickupLocation);
        }

        if (loadedCar.dropLocation) {
          setDropLocation(loadedCar.dropLocation);
        }
      } catch (err) {
        toast.error(
          err.message || 'Vehicle not found'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  // ============================================================
  // PRICING CALCULATION
  // ============================================================

  const pDate = new Date(pickupDate);
  const rDate = new Date(returnDate);

  const diffTime = Math.max(
    0,
    rDate - pDate
  );

  const numberOfDays = Math.max(
    1,
    Math.ceil(
      diffTime /
        (1000 * 60 * 60 * 24)
    )
  );

  const baseAmount = car
    ? numberOfDays * car.pricePerDay
    : 0;

  const tax =
    Math.round(
      baseAmount * 0.08 * 100
    ) / 100;

  const serviceFee = 25.0;

  const totalAmount =
    Math.round(
      (baseAmount +
        tax +
        serviceFee) *
        100
    ) / 100;

  // ============================================================
  // BOOKING CONFIRMATION
  // ============================================================

  const handleBookingConfirm = async (e) => {
    e.preventDefault();

    // Validate dates
    if (pDate >= rDate) {
      toast.error(
        'Pickup date cannot be after or equal to return date.'
      );
      return;
    }

    // Validate pickup location
    if (
      !pickupLocation ||
      !pickupLocation.name ||
      !Number.isFinite(
        Number(pickupLocation.latitude)
      ) ||
      !Number.isFinite(
        Number(pickupLocation.longitude)
      )
    ) {
      toast.error(
        'Please select a valid pickup location from the map or search results.'
      );
      return;
    }

    // Validate drop location
    if (
      !dropLocation ||
      !dropLocation.name ||
      !Number.isFinite(
        Number(dropLocation.latitude)
      ) ||
      !Number.isFinite(
        Number(dropLocation.longitude)
      )
    ) {
      toast.error(
        'Please select a valid drop-off location from the map or search results.'
      );
      return;
    }

    setSubmitting(true);

    try {
      // ========================================================
      // BOOKING PAYLOAD
      // ========================================================

      const payload = {
        carId: car._id,

        pickupDate:
          pDate.toISOString(),

        returnDate:
          rDate.toISOString(),

        // Exact selected pickup location
        pickupLocation: {
          name: pickupLocation.name,
          latitude: Number(
            pickupLocation.latitude
          ),
          longitude: Number(
            pickupLocation.longitude
          ),
        },

        // Exact selected drop location
        dropLocation: {
          name: dropLocation.name,
          latitude: Number(
            dropLocation.latitude
          ),
          longitude: Number(
            dropLocation.longitude
          ),
        },

        phone,
      };

      console.log(
        'Booking location payload:',
        {
          pickupLocation:
            payload.pickupLocation,
          dropLocation:
            payload.dropLocation,
        }
      );

      const res =
        await bookingsApi.create(
          payload
        );

      const createdBooking =
        res.data.data;

      toast.success(
        'Booking confirmed! Navigating to payment...'
      );

      // Continue with your existing payment flow
      navigate(
        `/payment/${createdBooking._id}`
      );
    } catch (err) {
      toast.error(
        err.message ||
          'Failed to create booking. Please check dates or availability.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full mx-auto mb-4 animate-spin" />

        <p className="text-slate-400 text-sm">
          Loading vehicle booking details...
        </p>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ======================================================
          BACK BUTTON
      ======================================================= */}

      <BackButton
        to={`/cars/${car._id}`}
        label="Back to Vehicle Details"
      />

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          Reservation Workflow
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Configure Your Booking
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review vehicle parameters, select rental duration,
          and choose your pickup and drop-off locations.
        </p>
      </div>

      {/* ======================================================
          MAIN GRID
      ======================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ====================================================
            BOOKING FORM
        ===================================================== */}

        <div className="lg:col-span-7 space-y-6">

          <form
            onSubmit={handleBookingConfirm}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-xs"
          >

            {/* ==================================================
                STEP 1 — DATES
            =================================================== */}

            <div className="space-y-3">

              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />

                Rental Schedule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Pickup Date */}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Pickup Date *
                  </label>

                  <input
                    type="date"
                    required
                    min={
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    }
                    value={pickupDate}
                    onChange={(e) =>
                      setPickupDate(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Return Date */}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Return Date *
                  </label>

                  <input
                    type="date"
                    required
                    min={pickupDate}
                    value={returnDate}
                    onChange={(e) =>
                      setReturnDate(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

              </div>

              <p className="text-[11px] text-slate-500">
                Calculated duration:{' '}
                <strong className="text-sky-400">
                  {numberOfDays} rental day(s)
                </strong>
              </p>

            </div>

            {/* ==================================================
                STEP 2 — LOCATION SELECTION
            =================================================== */}

            <div className="space-y-6 pt-4 border-t border-slate-800">

              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />

                Location Selection
              </h3>

              {/* =================================================
                  PICKUP
              ================================================== */}

              <div className="space-y-3">

                <div className="flex items-center justify-between">

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      🟢 Pickup Location
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Search for a location or click the map.
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                    Pickup
                  </span>

                </div>

                <LocationPicker
                  type="pickup"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  height="300px"
                />

              </div>

              {/* =================================================
                  DROP
              ================================================== */}

              <div className="space-y-3 pt-5 border-t border-slate-800">

                <div className="flex items-center justify-between">

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      🔴 Drop-off Location
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Search for a location or click the map.
                    </p>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                    Drop-off
                  </span>

                </div>

                <LocationPicker
                  type="drop"
                  value={dropLocation}
                  onChange={setDropLocation}
                  height="300px"
                />

              </div>

            </div>

            {/* ==================================================
                STEP 3 — CUSTOMER INFORMATION
            =================================================== */}

            <div className="space-y-3 pt-4 border-t border-slate-800">

              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />

                Primary Driver Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Driver Name */}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Driver Name
                  </label>

                  <input
                    type="text"
                    disabled
                    value={
                      user?.name ||
                      'Customer'
                    }
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-slate-300"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Email
                  </label>

                  <input
                    type="email"
                    disabled
                    value={
                      user?.email ||
                      'customer@example.com'
                    }
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 text-slate-300"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Contact Phone
                  </label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

              </div>

            </div>

            {/* ==================================================
                SELECTED LOCATION SUMMARY
            =================================================== */}

            <div className="pt-4 border-t border-slate-800 space-y-3">

              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Selected Route
              </h3>

              {/* Pickup Summary */}

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">

                <span className="text-lg">
                  🟢
                </span>

                <div className="min-w-0">

                  <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                    Pickup
                  </p>

                  <p className="text-xs text-white font-semibold break-words">
                    {pickupLocation.name}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {Number(
                      pickupLocation.latitude
                    ).toFixed(6)}
                    ,{' '}
                    {Number(
                      pickupLocation.longitude
                    ).toFixed(6)}
                  </p>

                </div>

              </div>

              {/* Drop Summary */}

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">

                <span className="text-lg">
                  🔴
                </span>

                <div className="min-w-0">

                  <p className="text-[10px] uppercase tracking-wider text-red-400 font-bold">
                    Drop-off
                  </p>

                  <p className="text-xs text-white font-semibold break-words">
                    {dropLocation.name}
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {Number(
                      dropLocation.latitude
                    ).toFixed(6)}
                    ,{' '}
                    {Number(
                      dropLocation.longitude
                    ).toFixed(6)}
                  </p>

                </div>

              </div>

            </div>

            {/* ==================================================
                SUBMIT
            =================================================== */}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-sky-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting
                ? 'Confirming & Generating QR...'
                : 'Confirm Booking & Proceed to Payment'}
            </button>

          </form>

        </div>

        {/* ====================================================
            PRICING SUMMARY
        ===================================================== */}

        <div className="lg:col-span-5 space-y-6">

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">

            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Reservation Summary
            </h3>

            {/* =================================================
                CAR SNAPSHOT
            ================================================== */}

            <div className="flex gap-4 items-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800">

              <img
                src={
                  car.images?.[0] ||
                  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'
                }
                alt={car.model}
                className="w-20 h-16 rounded-xl object-cover shrink-0"
              />

              <div className="min-w-0">

                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  {car.brand} • {car.year}
                </span>

                <h4 className="font-bold text-white text-sm truncate">
                  {car.model}
                </h4>

                <span className="text-xs text-slate-400">
                  {car.vehicleType} • {car.fuel}
                </span>

              </div>

            </div>

            {/* =================================================
                PRICE BREAKDOWN
            ================================================== */}

            <div className="space-y-3 text-xs pt-3 border-t border-slate-800">

              <div className="flex justify-between text-slate-300">

                <span>
                  Daily Rental (${car.pricePerDay} ×{' '}
                  {numberOfDays} days)
                </span>

                <span className="font-bold text-white">
                  ${baseAmount.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-slate-300">

                <span>
                  Estimated State Mobility Tax (8%)
                </span>

                <span className="font-bold text-white">
                  ${tax.toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between text-slate-300">

                <span>
                  Clean Fleet Preparation &amp;
                  Service Fee
                </span>

                <span className="font-bold text-white">
                  ${serviceFee.toFixed(2)}
                </span>

              </div>

            </div>

            {/* =================================================
                TOTAL
            ================================================== */}

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">

              <div>

                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Total Amount Due
                </span>

                <span className="text-xs text-sky-400 font-medium">
                  All taxes &amp; fees included
                </span>

              </div>

              <span className="text-3xl font-black text-white font-mono">
                ${totalAmount.toFixed(2)}
              </span>

            </div>

            {/* =================================================
                GUARANTEES
            ================================================== */}

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">

              <p className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />

                Free cancellation up to 24h before pickup
              </p>

              <p className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />

                Instant verification QR code issued upon confirmation
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};