import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { trackingApi, bookingsApi } from '../services/api';
import { MapView } from '../components/common/MapView';
import { BackButton } from '../components/common/BackButton';
import { Navigation, Play, Pause, RotateCw, MapPin, Gauge, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const requestedBookingId = searchParams.get('booking');

  const [bookings, setBookings] = useState([]);
  const [activeBookingId, setActiveBookingId] = useState(requestedBookingId || '');
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);

  // Load available customer bookings for tracking selector
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await bookingsApi.getMyBookings();
        const active = res.data.data.filter((b) => b.bookingStatus !== 'cancelled');
        setBookings(active);
        if (!activeBookingId && active.length > 0) {
          setActiveBookingId(active[0]._id);
        }
      } catch (err) {
        console.warn('Failed to load user bookings for tracking:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  // Fetch telemetry for current active booking
  const fetchTelemetry = async (id) => {
    if (!id) return;
    try {
      const res = await trackingApi.getByBooking(id);
      setTracking(res.data.data);
    } catch (err) {
      console.warn('Telemetry error:', err.message);
    }
  };

  useEffect(() => {
    if (activeBookingId) {
      fetchTelemetry(activeBookingId);
    }
  }, [activeBookingId]);

  // Periodic simulation loop
  useEffect(() => {
    let interval = null;
    if (isSimulating && activeBookingId) {
      interval = setInterval(async () => {
        try {
          const res = await trackingApi.simulate(activeBookingId);
          setTracking(res.data.data);
        } catch (err) {
          console.warn('Sim error:', err.message);
        }
      }, 3500); // Step every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isSimulating, activeBookingId]);

  const handleSimulateStep = async () => {
    if (!activeBookingId) return;
    try {
      const res = await trackingApi.simulate(activeBookingId);
      setTracking(res.data.data);
      toast.success('Vehicle moved forward along route waypoints.');
    } catch (err) {
      toast.error('Simulation step failed');
    }
  };

  const currentCoords = tracking?.currentCoordinates || { latitude: 37.7749, longitude: -122.4194 };
  const destCoords = tracking?.destinationCoordinates || { latitude: 37.6213, longitude: -122.3790 };
  const pickCoords = tracking?.pickupCoordinates || { latitude: 37.7749, longitude: -122.4194 };

  const routeLine = tracking?.routeWaypoints?.map((wp) => [wp.longitude, wp.latitude]) || [
    [pickCoords.longitude, pickCoords.latitude],
    [currentCoords.longitude, currentCoords.latitude],
    [destCoords.longitude, destCoords.latitude],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/bookings" label="Back to Bookings" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live GPS Telemetry Simulation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Real-Time Vehicle Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            OpenFreeMap vector tiles with dynamic GPS marker interpolation.
          </p>
        </div>

        {/* Booking Selector Dropdown if multiple bookings */}
        {bookings.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-400">Track Booking:</label>
            <select
              value={activeBookingId}
              onChange={(e) => setActiveBookingId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-sky-500"
            >
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.bookingCode} ({b.vehicleInfo?.brand} {b.vehicleInfo?.model})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tracking Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 shadow-2xl relative">
            {/* Status Floating Pill */}
            <div className="absolute top-8 left-8 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-bold text-white shadow-xl">
              <span className="text-lg">🚗</span>
              <span className="text-sky-400">
                {tracking?.status === 'arrived' ? 'Vehicle Arrived at Station' : 'Vehicle in Transit'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({currentCoords.latitude.toFixed(4)}, {currentCoords.longitude.toFixed(4)})
              </span>
            </div>

            {/* OpenFreeMap Canvas */}
            <MapView
              center={[currentCoords.longitude, currentCoords.latitude]}
              zoom={12}
              height="480px"
              routeCoordinates={routeLine}
              markers={[
                {
                  lng: currentCoords.longitude,
                  lat: currentCoords.latitude,
                  title: 'Active Vehicle Marker',
                  description: `Moving at ${tracking?.speedKmH || 45} km/h`,
                  isVehicle: true,
                },
                {
                  lng: pickCoords.longitude,
                  lat: pickCoords.latitude,
                  title: 'Pickup Location',
                  description: 'Initial Origin Station',
                  color: '#0ea5e9',
                },
                {
                  lng: destCoords.longitude,
                  lat: destCoords.latitude,
                  title: 'Destination Station',
                  description: 'Scheduled Drop Point',
                  color: '#10b981',
                },
              ]}
            />
          </div>

          {/* Simulation Toggle Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md ${
                  isSimulating
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulating ? 'Pause Auto-Simulation' : 'Resume Auto-Simulation'}</span>
              </button>

              <button
                onClick={handleSimulateStep}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
              >
                <RotateCw className="w-3.5 h-3.5" /> Step Forward
              </button>
            </div>

            <span className="text-slate-400">
              Live simulation ping: <strong className="text-sky-400">every 3.5s</strong>
            </span>
          </div>
        </div>

        {/* Telemetry Metrics Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Trip Telemetry</h3>

            {/* Vehicle Card Mini */}
            {tracking?.carId && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <img
                  src={tracking.carId.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341'}
                  alt={tracking.carId.model}
                  className="w-16 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {tracking.carId.brand} {tracking.carId.model}
                  </h4>
                  <span className="text-[11px] text-sky-400 block">{tracking.carId.vehicleType}</span>
                </div>
              </div>
            )}

            {/* Dynamic Metric Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" /> Est. Arrival
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {tracking?.estimatedArrivalMins || 28} <span className="text-xs font-normal text-slate-400">mins</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" /> Remaining
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {tracking?.distanceRemainingKm || 18.5} <span className="text-xs font-normal text-slate-400">km</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-sky-400" /> Current Velocity
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {tracking?.speedKmH || 48} <span className="text-xs font-normal text-slate-400">km/h</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-sky-400" /> Heading
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {tracking?.headingDeg || 135}° <span className="text-xs font-normal text-slate-400">SE</span>
                </span>
              </div>
            </div>

            {/* Coordinates & Waypoints info */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span>GPS Fix Quality:</span>
                <span className="text-emerald-400 font-bold">Differential GPS (Active)</span>
              </div>
              <div className="flex justify-between">
                <span>Last Telemetry Packet:</span>
                <span className="text-slate-300 font-mono">
                  {tracking?.lastUpdated ? new Date(tracking.lastUpdated).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Map Provider:</span>
                <span className="text-sky-400">OpenFreeMap (Liberty)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
