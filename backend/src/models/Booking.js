const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
      index: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '+1 (555) 019-2834' },
    },
    vehicleInfo: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      vehicleType: { type: String, required: true },
      image: { type: String },
    },
    pickupDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnDate: {
      type: Date,
      required: true,
      index: true,
    },
    pickupLocation: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    dropLocation: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    serviceFee: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
      index: true,
    },
    qrVerificationStatus: {
      type: Boolean,
      default: false,
    },
    qrCodeString: {
      type: String,
    },
    verifiedAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for conflict detection
bookingSchema.index({ carId: 1, pickupDate: 1, returnDate: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
