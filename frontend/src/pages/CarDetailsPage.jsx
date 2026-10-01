import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { carsApi, reviewsApi } from '../services/api';
import { MapView } from '../components/common/MapView';
import { BackButton } from '../components/common/BackButton';
import {
  Users,
  Fuel,
  Gauge,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const [carRes, reviewsRes] = await Promise.all([
          carsApi.getById(id),
          reviewsApi.getByCar(id),
        ]);
        setCar(carRes.data.data);
        setReviews(reviewsRes.data.data);
      } catch (err) {
        toast.error(err.message || 'Vehicle details could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await reviewsApi.create({
        carId: id,
        ...newReview,
      });
      setReviews([res.data.data, ...reviews]);
      setNewReview({ rating: 5, title: '', comment: '' });
      toast.success('Thank you! Review published and stored in MongoDB.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit review. Please log in.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 w-32 bg-slate-900 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="h-[450px] bg-slate-900 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-900 rounded w-3/4 animate-pulse" />
            <div className="h-24 bg-slate-900 rounded animate-pulse" />
            <div className="h-40 bg-slate-900 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-sm text-slate-400">The requested car record is not available in the database.</p>
        <Link to="/cars" className="inline-block px-5 py-2.5 rounded-xl bg-sky-500 text-white font-bold text-xs">
          Browse All Vehicles
        </Link>
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
  ];

  const currentImg = images[activeImageIndex].startsWith('/uploads')
    ? `http://localhost:5000${images[activeImageIndex]}`
    : images[activeImageIndex];

  const pickupCoords = car.pickupLocation || { name: 'Downtown Hub', latitude: 37.7749, longitude: -122.4194 };
  const dropCoords = car.dropLocation || { name: 'SFO Airport', latitude: 37.6213, longitude: -122.3790 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Button */}
      <BackButton to="/cars" label="Back to Cars" />

      {/* Top Header & Price Overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              {car.brand} • {car.year}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
              {car.vehicleType}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {car.model}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {car.ratingsAverage}
            </span>
            <span>•</span>
            <span>{car.ratingsQuantity} verified guest ratings</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> {pickupCoords.name}
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Daily Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">${car.pricePerDay}</span>
              <span className="text-xs text-slate-400">/ day</span>
            </div>
          </div>

          <Link
            to={car.isAvailable ? `/book/${car._id}` : '#'}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${
              car.isAvailable
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            onClick={(e) => !car.isAvailable && e.preventDefault()}
          >
            <span>{car.isAvailable ? 'Book This Car' : 'Currently Reserved'}</span>
            {car.isAvailable && <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>

      {/* Main Grid: Gallery & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative">
            <img
              src={currentImg}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 right-4">
              {car.isAvailable ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Dispatch
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-400 text-xs font-semibold">
                  <XCircle className="w-3.5 h-3.5" /> Booked
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => {
                const formatted = img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-sky-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={formatted} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Description */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Vehicle Overview</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Features Checklist */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Equipped Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
              {car.features?.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs & Booking Card Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Specs Matrix */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Engine / Drivetrain</span>
                <span className="text-white font-bold text-sm mt-0.5 block flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-sky-400" /> {car.fuel}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Transmission</span>
                <span className="text-white font-bold text-sm mt-0.5 block flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-sky-400" /> {car.transmission}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Passenger Seating</span>
                <span className="text-white font-bold text-sm mt-0.5 block flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-400" /> {car.seats} Passengers
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Model Year</span>
                <span className="text-white font-bold text-sm mt-0.5 block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-400" /> {car.year} Release
                </span>
              </div>
            </div>
          </div>

          {/* OpenFreeMap Location & Hubs */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Pickup Location Map</h3>
              <span className="text-[10px] text-sky-400 font-mono">OpenFreeMap Vector</span>
            </div>
            <p className="text-xs text-slate-400">
              Vehicle stationed at: <strong className="text-white">{pickupCoords.name}</strong>
            </p>
            <MapView
              center={[pickupCoords.longitude, pickupCoords.latitude]}
              zoom={13}
              height="240px"
              markers={[
                {
                  lng: pickupCoords.longitude,
                  lat: pickupCoords.latitude,
                  title: `${car.brand} ${car.model}`,
                  description: `Pickup Hub: ${pickupCoords.name}`,
                  color: '#0ea5e9',
                  isVehicle: true,
                },
              ]}
            />
          </div>

          {/* Quick CTA Card */}
          <div className="glass-panel p-6 rounded-2xl border border-sky-500/20 bg-sky-950/20 text-center space-y-3">
            <h4 className="text-sm font-bold text-white">Instant Contactless Reservation</h4>
            <p className="text-xs text-slate-300">
              Book online to receive an instant verification QR pass and live GPS tracking when your trip begins.
            </p>
            <Link
              to={car.isAvailable ? `/book/${car._id}` : '#'}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider block transition-all shadow-md ${
                car.isAvailable
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              onClick={(e) => !car.isAvailable && e.preventDefault()}
            >
              {car.isAvailable ? 'Proceed to Booking' : 'Vehicle Unavailable'}
            </Link>
          </div>
        </div>
      </div>

      {/* Guest Reviews Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Verified Traveler Reviews</h3>
            <p className="text-xs text-slate-400 mt-1">Real ratings submitted to MongoDB by customers who rented this car.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{car.ratingsAverage}</span>
            <span className="text-slate-400">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Write Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Leave a Review for this Vehicle</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value="3">⭐⭐⭐ (3 - Average)</option>
                <option value="2">⭐⭐ (2 - Below Expectation)</option>
                <option value="1">⭐ (1 - Poor)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Review Headline</label>
              <input
                type="text"
                required
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="e.g. Unbelievable road manners and comfort"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Commentary</label>
            <textarea
              required
              rows="2"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Describe your driving experience, acceleration, cabin ergonomics, and trip..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={submittingReview}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow shadow-sky-500/20 disabled:opacity-50"
          >
            {submittingReview ? 'Saving Review to MongoDB...' : 'Post Review'}
          </button>
        </form>

        {/* Existing Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to share your driving impressions!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{rev.userName}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <h5 className="font-semibold text-sky-400 text-xs">{rev.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-slate-500 block pt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
