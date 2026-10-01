import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';

export const CarFilter = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Filter Fleet</h3>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="Search model, brand, or feature..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Row 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* Brand */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">Brand</label>
          <select
            name="brand"
            value={filters.brand || 'All'}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Brands</option>
            <option value="Porsche">Porsche</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Tesla">Tesla</option>
            <option value="BMW">BMW</option>
            <option value="Audi">Audi</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Hyundai">Hyundai</option>
            <option value="Toyota">Toyota</option>
          </select>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">Vehicle Type</label>
          <select
            name="vehicleType"
            value={filters.vehicleType || 'All'}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Types</option>
            <option value="Electric">Electric</option>
            <option value="Luxury">Luxury</option>
            <option value="SUV">SUV</option>
            <option value="Sports">Sports</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">Fuel Type</label>
          <select
            name="fuel"
            value={filters.fuel || 'All'}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Fuels</option>
            <option value="Electric">Electric</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">Transmission</label>
          <select
            name="transmission"
            value={filters.transmission || 'All'}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Seats */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">Min Seats</label>
          <select
            name="seats"
            value={filters.seats || 'All'}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Any Capacity</option>
            <option value="4">4+ Seats</option>
            <option value="5">5+ Seats</option>
            <option value="7">7+ Seats</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">Availability</label>
          <select
            name="isAvailable"
            value={filters.isAvailable !== undefined ? filters.isAvailable : ''}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="">All Vehicles</option>
            <option value="true">Available Now</option>
            <option value="false">Reserved Only</option>
          </select>
        </div>
      </div>

      {/* Sorting & Max Price Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
            Max Price: <span className="text-sky-400 font-bold">${filters.maxPrice || 400}/day</span>
          </label>
          <input
            type="range"
            name="maxPrice"
            min="50"
            max="400"
            step="10"
            value={filters.maxPrice || 400}
            onChange={handleChange}
            className="w-full sm:w-48 accent-sky-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <label className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Sort By:</label>
          <select
            name="sortBy"
            value={filters.sortBy || 'newest'}
            onChange={handleChange}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="newest">Newest Fleet Addition</option>
            <option value="popular">Most Popular & Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};
