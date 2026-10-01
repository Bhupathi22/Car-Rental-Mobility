const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
      index: true,
    },
    currentCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    pickupCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    destinationCoordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    routeWaypoints: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],
    distanceRemainingKm: {
      type: Number,
      default: 15.4,
    },
    estimatedArrivalMins: {
      type: Number,
      default: 24,
    },
    speedKmH: {
      type: Number,
      default: 45,
    },
    headingDeg: {
      type: Number,
      default: 120,
    },
    status: {
      type: String,
      enum: ['idle', 'in_transit', 'arrived', 'completed'],
      default: 'in_transit',
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Tracking', trackingSchema);
