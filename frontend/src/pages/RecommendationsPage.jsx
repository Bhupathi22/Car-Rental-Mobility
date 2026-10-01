import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../services/api';
import { BackButton } from '../components/common/BackButton';
import { CarCard } from '../components/cars/CarCard';
import { Sparkles, Users, DollarSign, Fuel, Gauge, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const RecommendationsPage = () => {
  const [criteria, setCriteria] = useState({
    purpose: 'Travel',
    passengers: 4,
    budget: 200,
    preferredFuel: 'Any',
    transmission: 'Any',
    vehicleType: 'Any',
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendationsApi.get(criteria);
      setRecommendations(res.data.data);
      setHasSearched(true);
      toast.success(`Generated ${res.data.data.length} tailored vehicle recommendations!`);
    } catch (err) {
      toast.error(err.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate initial recommendation set on mount
    fetchRecommendations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const purposes = [
    { id: 'Family', label: 'Family Vacation', desc: 'High capacity, child safety anchors & ample luggage' },
    { id: 'Business', label: 'Executive Business', desc: 'Prestige sedans, quiet cabins & leather comfort' },
    { id: 'Travel', label: 'Long Distance Touring', desc: 'High efficiency, adaptive cruise & long range' },
    { id: 'Luxury', label: 'Flagship Luxury', desc: 'Ultimate prestige, top-tier audio & massage seats' },
    { id: 'Budget', label: 'Budget Smart', desc: 'Maximum fuel economy & low daily rental rates' },
    { id: 'Adventure', label: 'Mountain & Adventure', desc: 'All-terrain capability, AWD traction & rugged clearance' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <BackButton to="/" label="Back to Home" />

      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Intelligent Fleet Matchmaker
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
          AI &amp; Rule-Based Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Answer a few quick journey preferences to let our multi-parameter scoring engine rank the optimal fleet vehicle for your exact route.
        </p>
      </div>

      {/* Preferences Questionnaire Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8 text-xs">
        {/* Purpose Cards Selector */}
        <div className="space-y-3">
          <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            1. What is the Primary Purpose of Your Trip? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {purposes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setCriteria({ ...criteria, purpose: p.id })}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  criteria.purpose === p.id
                    ? 'bg-sky-500/15 border-sky-500 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-xs">{p.label}</h4>
                  {criteria.purpose === p.id && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders and Preferences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-800">
          {/* Passenger Capacity */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" /> Passenger Count
              </span>
              <strong className="text-sky-400 font-bold">{criteria.passengers} Seats</strong>
            </label>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={criteria.passengers}
              onChange={(e) => setCriteria({ ...criteria, passengers: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>2 Coupe</span>
              <span>5 Family</span>
              <span>8 Van/SUV</span>
            </div>
          </div>

          {/* Daily Budget */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Max Daily Budget
              </span>
              <strong className="text-emerald-400 font-bold">${criteria.budget} / day</strong>
            </label>
            <input
              type="range"
              min="60"
              max="400"
              step="10"
              value={criteria.budget}
              onChange={(e) => setCriteria({ ...criteria, budget: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$60 Economy</span>
              <span>$200 Premium</span>
              <span>$400+ Exotic</span>
            </div>
          </div>

          {/* Preferred Fuel */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-sky-400" /> Drivetrain / Fuel
            </label>
            <select
              value={criteria.preferredFuel}
              onChange={(e) => setCriteria({ ...criteria, preferredFuel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Any">Any Fuel Engine</option>
              <option value="Electric">Pure Electric (EV)</option>
              <option value="Hybrid">Hybrid Economy</option>
              <option value="Petrol">Petrol Performance</option>
              <option value="Diesel">Diesel Touring</option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400" /> Body Category
            </label>
            <select
              value={criteria.vehicleType}
              onChange={(e) => setCriteria({ ...criteria, vehicleType: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Any">Any Vehicle Class</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Luxury">Flagship Luxury</option>
              <option value="Sports">Sports GT</option>
              <option value="Electric">Electric</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Evaluating Scoring Rules...' : 'Re-Calculate Recommendations'}
          </button>
        </div>
      </form>

      {/* Recommendations Results Section */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            Tailored Matches
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Recommended for You
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by multi-attribute scoring based on passenger capacity, daily budget, and trip profile.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center">
            <p className="text-sm text-slate-400">No vehicles met all filter conditions. Try expanding your budget range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recommendations.map((item, idx) => (
              <div key={idx} className="flex flex-col space-y-3">
                {/* Scoring Header */}
                <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sky-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Match Score: {item.score}%
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                      Rank #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug italic">
                    "{item.reason}"
                  </p>
                </div>

                {/* Car Card */}
                <CarCard car={item.car} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
