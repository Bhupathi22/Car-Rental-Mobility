import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { carsApi } from '../services/api';
import { CarCard } from '../components/cars/CarCard';
import { MapView } from '../components/common/MapView';

import {
  Car,
  Calendar,
  MapPin,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  Star,
  Compass,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar state
  const [searchParams, setSearchParams] = useState({
    pickupLocation: 'Downtown Mobility Hub, San Francisco',
    dropLocation: 'SFO International Airport',
    pickupDate: new Date(Date.now() + 86400000)
      .toISOString()
      .split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 4)
      .toISOString()
      .split('T')[0],
  });

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await carsApi.getAll({ sortBy: 'popular' });

        if (res?.data?.data) {
          setPopularCars(res.data.data.slice(0, 3));
        } else {
          setPopularCars([]);
        }
      } catch (err) {
        console.error(
          'Failed to load cars for homepage:',
          err?.message || err
        );
        setPopularCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    navigate(
      `/cars?pickup=${encodeURIComponent(
        searchParams.pickupLocation
      )}&drop=${encodeURIComponent(
        searchParams.dropLocation
      )}&from=${searchParams.pickupDate}&to=${searchParams.returnDate}`
    );
  };

  return (
    <div className="space-y-24">
      {/* =========================================================
          1. HERO SECTION
      ========================================================= */}

      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEXT-GENERATION AUTOMOTIVE MOBILITY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] uppercase">
              CAR RENTAL &amp; MOBILITY
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              "Move Freely. Travel Smarter."
            </p>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Experience prestige performance, live GPS telemetry on
              OpenFreeMap, seamless QR vehicle verification, and instant
              booking backed by real MongoDB persistence.
            </p>
          </div>

          {/* Search Booking Bar Widget */}
          <div className="mt-10 max-w-4xl mx-auto glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs"
            >
              {/* Pickup Location */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Pickup Location
                </label>

                <select
                  value={searchParams.pickupLocation}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      pickupLocation: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="Downtown Mobility Hub, San Francisco">
                    Downtown Hub, SF
                  </option>

                  <option value="Financial District Plaza, San Francisco">
                    Financial District Plaza
                  </option>

                  <option value="Presidio Heights Mobility Center, San Francisco">
                    Presidio Heights Center
                  </option>

                  <option value="Mission Bay Mobility Station, San Francisco">
                    Mission Bay Station
                  </option>

                  <option value="Berkeley Campus Hub, Berkeley">
                    Berkeley Campus Hub
                  </option>
                </select>
              </div>

              {/* Drop Location */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  Drop Location
                </label>

                <select
                  value={searchParams.dropLocation}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      dropLocation: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="SFO International Airport">
                    SFO Int&apos;l Airport
                  </option>

                  <option value="Silicon Valley VIP Terminal, San Jose">
                    Silicon Valley VIP Terminal
                  </option>

                  <option value="Oakland International Airport">
                    Oakland Int&apos;l Airport
                  </option>

                  <option value="Downtown Mobility Hub, San Francisco">
                    Downtown Hub, SF
                  </option>

                  <option value="Napa Valley Valley Terminal">
                    Napa Valley Terminal
                  </option>
                </select>
              </div>

              {/* Pickup Date */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Pickup Date
                </label>

                <input
                  type="date"
                  value={searchParams.pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      pickupDate: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Return Date */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  Return Date
                </label>

                <input
                  type="date"
                  value={searchParams.returnDate}
                  min={searchParams.pickupDate}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      returnDate: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[42px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Search Cars
                </button>
              </div>
            </form>
          </div>

          {/* Large Premium Car Visual */}
          <div className="mt-14 relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 aspect-[21/9] max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1800&q=85"
              alt="Porsche Taycan Flagship"
              className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-left">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/40">
                FLAGSHIP FLEET
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
                Porsche Taycan 4S
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-1">
                Zero emissions. Pure adrenaline. Available with express
                digital QR contactless release.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. POPULAR VEHICLES SECTION
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
              Top Rated by Travelers
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Popular Vehicles
            </h2>
          </div>

          <Link
            to="/cars"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>View Full Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          3. HOW IT WORKS
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Streamlined Process
          </span>

          <h2 className="text-3xl font-extrabold text-white mt-1">
            How It Works
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Four intuitive steps from discovery to seamless keyless vehicle
            ignition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Browse & Choose',
              desc: 'Select from our verified luxury, electric, and performance fleet with real-time specs.',
              icon: Car,
            },
            {
              step: '02',
              title: 'Reserve Instantly',
              desc: 'Select pickup & drop hubs with date validation and instant transparent fee calculation.',
              icon: Calendar,
            },
            {
              step: '03',
              title: 'Scan QR Check-In',
              desc: 'Receive cryptographic verification QR token for immediate physical car verification.',
              icon: ShieldCheck,
            },
            {
              step: '04',
              title: 'Live GPS Tracking',
              desc: 'Track arrival and trip waypoints in real-time rendered on OpenFreeMap with MapLibre.',
              icon: Compass,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 relative group"
            >
              <span className="text-3xl font-black text-slate-800 group-hover:text-sky-500/30 transition-colors">
                {item.step}
              </span>

              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center my-3 text-sky-400">
                <item.icon className="w-5 h-5" />
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. WHY CHOOSE US & MOBILITY FEATURES
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Superior Engineering
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Choose CAR RENTAL &amp; MOBILITY?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Designed as an enterprise-grade academic platform integrating
              modern full-stack architectures, real MongoDB persistence, JWT
              role-based security, and dynamic MapLibre telemetry.
            </p>

            <div className="space-y-3.5 text-xs text-slate-300">
              {[
                '100% Genuine Database Persistence (No localStorage illusions)',
                'OpenFreeMap Integration with MapLibre GL JS & Liberty Vector Tiles',
                'Cryptographic QR Booking Verification and Audit Trails',
                'Modular Service Architecture (Ready for Microservices Evolution)',
                'Rule-Based Vehicle Recommendation Engine',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                <span>Read Full Technical Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">
                Active Bay Area Fleet Hubs
              </span>

              <span className="flex items-center gap-1.5 text-sky-400">
                <Zap className="w-3.5 h-3.5" />
                OpenFreeMap Liberty
              </span>
            </div>

            <MapView
              center={[-122.4194, 37.7749]}
              zoom={11}
              height="340px"
              markers={[
                {
                  lng: -122.4194,
                  lat: 37.7749,
                  title: 'Downtown SF Hub',
                  description: 'Flagship electric charging hub',
                },
                {
                  lng: -122.379,
                  lat: 37.6213,
                  title: 'SFO Airport Station',
                  description: '24/7 express dispatch',
                },
                {
                  lng: -122.3999,
                  lat: 37.7946,
                  title: 'Financial Plaza',
                  description: 'Executive sedan lounge',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          5. TESTIMONIALS
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Guest Feedback
          </span>

          <h2 className="text-3xl font-extrabold text-white mt-1">
            Verified Traveler Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Marcus Vance',
              role: 'Executive Director',
              avatar:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              comment:
                'The Mercedes S-Class arrived impeccably clean. The QR check-in took literally 10 seconds at SFO airport.',
              stars: 5,
              car: 'Mercedes-Benz S-Class',
            },
            {
              name: 'Elena Rostova',
              role: 'Software Architect',
              avatar:
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              comment:
                'Rented the Porsche Taycan for coastal driving. Incredible responsiveness and the live tracking on OpenFreeMap is super slick!',
              stars: 5,
              car: 'Porsche Taycan 4S',
            },
            {
              name: 'David Chen',
              role: 'Product Designer',
              avatar:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
              comment:
                'The smart recommendation tool picked the Tesla Model X for our 6-person family road trip. Spot on capacity and luggage space.',
              stars: 5,
              car: 'Tesla Model X Plaid',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-800">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover border border-sky-500/30"
                />

                <div>
                  <h4 className="text-xs font-bold text-white">
                    {item.name}
                  </h4>

                  <span className="text-[10px] text-sky-400 block">
                    {item.car}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          6. CALL TO ACTION
      ========================================================= */}

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-center text-white shadow-2xl shadow-sky-500/20">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Ready to Experience True Mobility?
          </h2>

          <p className="text-sm sm:text-base text-sky-100 max-w-xl mx-auto mt-2 mb-8">
            Join thousands of travelers exploring in premium vehicles with
            instant QR verification and live GPS telemetry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/cars"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-100 shadow-xl transition-all"
            >
              Reserve a Vehicle Now
            </Link>

            <Link
              to="/recommendations"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 border border-white/20 text-white font-bold text-sm transition-all"
            >
              Get Smart Recommendations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};