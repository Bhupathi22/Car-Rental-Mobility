import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { carsApi } from '../services/api';
import { CarCard } from '../components/cars/CarCard';
import { CarFilter } from '../components/cars/CarFilter';
import { BackButton } from '../components/common/BackButton';
import { Car, AlertCircle, RefreshCw } from 'lucide-react';

export const CarsPage = () => {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFilters = {
    brand: 'All',
    vehicleType: searchParams.get('type') || 'All',
    fuel: 'All',
    transmission: 'All',
    seats: 'All',
    maxPrice: 400,
    isAvailable: '',
    search: searchParams.get('search') || '',
    sortBy: 'newest',
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await carsApi.getAll(filters);
      setCars(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load cars from MongoDB database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Back Navigation */}
      <div>
        <BackButton to="/" label="Back to Home" />
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
              Live Fleet Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Explore Available Vehicles
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            Showing <strong className="text-white">{cars.length}</strong> vehicles in MongoDB
          </span>
        </div>
      </div>

      {/* Filter Component */}
      <CarFilter filters={filters} setFilters={setFilters} onReset={handleResetFilters} />

      {/* Cars Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[420px] rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Database Fetch Error</h3>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchCars}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Query
          </button>
        </div>
      ) : cars.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <Car className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Vehicles Match Criteria</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Try adjusting your budget, vehicle type, or fuel filters to explore other models in the fleet.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};
