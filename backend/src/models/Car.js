const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [2010, 'Year must be 2010 or newer'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['Sedan', 'SUV', 'Luxury', 'Sports', 'Hatchback', 'Electric'],
      index: true,
    },
    fuel: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    },
    transmission: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: ['Automatic', 'Manual'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [2, 'Minimum 2 seats'],
      max: [10, 'Maximum 10 seats'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [1, 'Price per day must be at least $1'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Car description is required'],
    },
    features: {
      type: [String],
      default: ['GPS Navigation', 'Bluetooth', 'Backup Camera', 'Heated Seats', 'Cruise Control'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      default: [],
    },
    pickupLocation: {
      name: { type: String, default: 'Downtown Hub, San Francisco' },
      latitude: { type: Number, default: 37.7749 },
      longitude: { type: Number, default: -122.4194 },
    },
    dropLocation: {
      name: { type: String, default: 'SFO International Airport' },
      latitude: { type: Number, default: 37.6213 },
      longitude: { type: Number, default: -122.3790 },
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimized catalog filtering
carSchema.index({ isAvailable: 1, vehicleType: 1, pricePerDay: 1 });

module.exports = mongoose.model('Car', carSchema);
