import React, { useState, useEffect } from 'react';
import { carsApi } from '../services/api';
import { CarFormModal } from '../components/cars/CarFormModal';
import { BackButton } from '../components/common/BackButton';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search, RefreshCw, Car } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await carsApi.getAll({ search });
      setCars(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch fleet cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setModalOpen(true);
  };

  const handleDelete = async (carId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from MongoDB fleet?`)) return;

    try {
      await carsApi.delete(carId);
      toast.success(`Vehicle "${name}" deleted from MongoDB.`);
      fetchCars();
    } catch (err) {
      toast.error(err.message || 'Failed to delete vehicle');
    }
  };

  const handleToggleAvailability = async (carId, currentStatus) => {
    try {
      await carsApi.toggleAvailability(carId, !currentStatus);
      toast.success(`Availability toggled to ${!currentStatus ? 'Available' : 'Unavailable'}`);
      fetchCars();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle availability');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton to="/admin" label="Back to Dashboard" />

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            Fleet Operations Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Vehicles Fleet CRUD
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update, toggle availability, or remove vehicles directly from MongoDB Atlas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Vehicle
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand, model, or class..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          onClick={fetchCars}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Cars CRUD Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Vehicle</th>
                <th className="py-4 px-6">Class &amp; Drivetrain</th>
                <th className="py-4 px-6">Seating</th>
                <th className="py-4 px-6">Rate / Day</th>
                <th className="py-4 px-6">Availability</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mx-auto mb-2" />
                    Fetching vehicles from MongoDB...
                  </td>
                </tr>
              ) : cars.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No fleet vehicles found matching query.
                  </td>
                </tr>
              ) : (
                cars.map((car) => {
                  const img =
                    car.images?.[0]?.startsWith('/uploads')
                      ? `http://localhost:5000${car.images[0]}`
                      : car.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341';

                  return (
                    <tr key={car._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={car.model}
                            className="w-14 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {car.brand} {car.model}
                            </span>
                            <span className="text-[11px] text-sky-400">{car.year} Release</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-white block">{car.vehicleType}</span>
                        <span className="text-[11px] text-slate-400">
                          {car.fuel} • {car.transmission}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-200">
                        {car.seats} Passengers
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-white text-sm">${car.pricePerDay}</span>
                        <span className="text-[10px] text-slate-400"> / day</span>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(car._id, car.isAvailable)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                            car.isAvailable
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {car.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{car.isAvailable ? 'Available' : 'Unavailable'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(car)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(car._id, `${car.brand} ${car.model}`)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      <CarFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCars}
        initialCar={editingCar}
      />
    </div>
  );
};
