import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { carsApi } from '../../services/api';
import toast from 'react-hot-toast';

export const CarFormModal = ({ isOpen, onClose, onSuccess, initialCar = null }) => {
  const isEditing = !!initialCar;

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2024,
    vehicleType: 'Sedan',
    fuel: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 150,
    description: '',
    features: ['GPS Navigation', 'Bluetooth', 'Backup Camera'],
    imageUrl: '',
    pickupLocationName: 'Downtown Mobility Hub, San Francisco',
    pickupLat: 37.7749,
    pickupLng: -122.4194,
    dropLocationName: 'SFO International Airport',
    dropLat: 37.6213,
    dropLng: -122.3790,
    isAvailable: true,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialCar) {
      setFormData({
        brand: initialCar.brand || '',
        model: initialCar.model || '',
        year: initialCar.year || 2024,
        vehicleType: initialCar.vehicleType || 'Sedan',
        fuel: initialCar.fuel || 'Petrol',
        transmission: initialCar.transmission || 'Automatic',
        seats: initialCar.seats || 5,
        pricePerDay: initialCar.pricePerDay || 150,
        description: initialCar.description || '',
        features: initialCar.features || ['GPS Navigation', 'Bluetooth'],
        imageUrl: initialCar.images?.[0] || '',
        pickupLocationName: initialCar.pickupLocation?.name || 'Downtown Mobility Hub, San Francisco',
        pickupLat: initialCar.pickupLocation?.latitude || 37.7749,
        pickupLng: initialCar.pickupLocation?.longitude || -122.4194,
        dropLocationName: initialCar.dropLocation?.name || 'SFO International Airport',
        dropLat: initialCar.dropLocation?.latitude || 37.6213,
        dropLng: initialCar.dropLocation?.longitude || -122.3790,
        isAvailable: initialCar.isAvailable !== undefined ? initialCar.isAvailable : true,
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        year: 2024,
        vehicleType: 'Sedan',
        fuel: 'Petrol',
        transmission: 'Automatic',
        seats: 5,
        pricePerDay: 150,
        description: '',
        features: ['GPS Navigation', 'Bluetooth', 'Backup Camera'],
        imageUrl: '',
        pickupLocationName: 'Downtown Mobility Hub, San Francisco',
        pickupLat: 37.7749,
        pickupLng: -122.4194,
        dropLocationName: 'SFO International Airport',
        dropLat: 37.6213,
        dropLng: -122.3790,
        isAvailable: true,
      });
    }
  }, [initialCar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (feat) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feat),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('brand', formData.brand);
      data.append('model', formData.model);
      data.append('year', Number(formData.year));
      data.append('vehicleType', formData.vehicleType);
      data.append('fuel', formData.fuel);
      data.append('transmission', formData.transmission);
      data.append('seats', Number(formData.seats));
      data.append('pricePerDay', Number(formData.pricePerDay));
      data.append('description', formData.description);
      data.append('features', JSON.stringify(formData.features));
      data.append('isAvailable', formData.isAvailable);

      data.append(
        'pickupLocation',
        JSON.stringify({
          name: formData.pickupLocationName,
          latitude: Number(formData.pickupLat),
          longitude: Number(formData.pickupLng),
        })
      );

      data.append(
        'dropLocation',
        JSON.stringify({
          name: formData.dropLocationName,
          latitude: Number(formData.dropLat),
          longitude: Number(formData.dropLng),
        })
      );

      if (formData.imageUrl.trim()) {
        data.append('images', JSON.stringify([formData.imageUrl.trim()]));
      }

      if (selectedFile) {
        data.append('images', selectedFile);
      }

      if (isEditing) {
        await carsApi.update(initialCar._id, data);
        toast.success(`Vehicle ${formData.brand} ${formData.model} updated in MongoDB!`);
      } else {
        await carsApi.create(data);
        toast.success(`Vehicle ${formData.brand} ${formData.model} saved to MongoDB!`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-white">
            {isEditing ? 'Edit Fleet Vehicle' : 'Add Vehicle to Fleet'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Persists in MongoDB. Updates will immediately propagate to customer search and listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brand *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Porsche, Tesla, BMW"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Model *</label>
              <input
                type="text"
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Taycan Turbo, Model S"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Year, Type, Fuel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Year *</label>
              <input
                type="number"
                name="year"
                required
                min="2010"
                max="2026"
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Sports">Sports</option>
                <option value="Electric">Electric</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fuel Type *</label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Transmission, Seats, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transmission *</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Seats (2-10) *</label>
              <input
                type="number"
                name="seats"
                min="2"
                max="10"
                required
                value={formData.seats}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price Per Day ($) *</label>
              <input
                type="number"
                name="pricePerDay"
                min="10"
                required
                value={formData.pricePerDay}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Vehicle Description *</label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Highlight luxury interior, powertrain responsiveness, and convenience..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          {/* Features Tag Builder */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g. All-Wheel Drive, Heated Steering"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-sky-400"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => removeFeature(feat)}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Image URL or File Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Image URL (Direct / Unsplash)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Or Upload Local Image (Multer)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30"
                />
              </div>
            </div>
          </div>

          {/* Locations & Coordinates */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
              OpenFreeMap Coordinates & Geo-locations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Pickup Hub Name</label>
                <input
                  type="text"
                  name="pickupLocationName"
                  value={formData.pickupLocationName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pickup Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="pickupLat"
                  value={formData.pickupLat}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pickup Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="pickupLng"
                  value={formData.pickupLng}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-slate-400 mb-1">Drop Hub Name</label>
                <input
                  type="text"
                  name="dropLocationName"
                  value={formData.dropLocationName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Drop Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="dropLat"
                  value={formData.dropLat}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Drop Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="dropLng"
                  value={formData.dropLng}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
            <label htmlFor="isAvailable" className="text-slate-300 font-semibold cursor-pointer">
              Mark vehicle as Available for immediate booking
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-sky-500/20 disabled:opacity-60 flex items-center gap-2"
            >
              {submitting ? 'Saving to MongoDB...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
