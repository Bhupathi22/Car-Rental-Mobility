const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Tracking = require('../models/Tracking');
const { generateBookingQRCode } = require('../utils/qrGenerator');

const createBooking = async ({
  userId,
  carId,
  customerInfo,
  pickupDate,
  returnDate,
  pickupLocation,
  dropLocation,
}) => {
  const pDate = new Date(pickupDate);
  const rDate = new Date(returnDate);

  if (pDate >= rDate) {
    const error = new Error('Pickup date cannot be after or equal to return date.');
    error.statusCode = 400;
    throw error;
  }

  const car = await Car.findById(carId);
  if (!car) {
    const error = new Error('Selected vehicle could not be found.');
    error.statusCode = 404;
    throw error;
  }

  if (!car.isAvailable) {
    const error = new Error('Vehicle is currently marked as unavailable for booking.');
    error.statusCode = 400;
    throw error;
  }

  // Check for overlapping confirmed or active bookings
  const overlappingBooking = await Booking.findOne({
    carId,
    bookingStatus: { $in: ['confirmed', 'active'] },
    $or: [
      { pickupDate: { $lte: rDate }, returnDate: { $gte: pDate } },
    ],
  });

  if (overlappingBooking) {
    const error = new Error('Vehicle is unavailable for the selected dates due to an existing booking.');
    error.statusCode = 400;
    throw error;
  }

  // Calculate duration in days
  const diffTime = Math.abs(rDate - pDate);
  const numberOfDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const baseAmount = numberOfDays * car.pricePerDay;
  const tax = Math.round(baseAmount * 0.08 * 100) / 100; // 8% tax
  const serviceFee = 25.0; // Flat service charge
  const totalAmount = Math.round((baseAmount + tax + serviceFee) * 100) / 100;

  // Generate unique booking code
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const bookingCode = `CR-${new Date().getFullYear()}-${randomSuffix}`;

  // Create preliminary booking document
  const booking = new Booking({
    bookingCode,
    userId,
    carId,
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone || '+1 (555) 019-2834',
    },
    vehicleInfo: {
      brand: car.brand,
      model: car.model,
      year: car.year,
      vehicleType: car.vehicleType,
      image: car.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    },
    pickupDate: pDate,
    returnDate: rDate,
    pickupLocation: pickupLocation || car.pickupLocation,
    dropLocation: dropLocation || car.dropLocation,
    numberOfDays,
    pricePerDay: car.pricePerDay,
    baseAmount,
    tax,
    serviceFee,
    totalAmount,
    bookingStatus: 'confirmed',
    paymentStatus: 'unpaid',
    qrVerificationStatus: false,
  });

  // Generate real QR code image
  const qrCodeString = await generateBookingQRCode(bookingCode, booking._id.toString());
  booking.qrCodeString = qrCodeString;
  await booking.save();

  // Create simulated tracking route between pickup and drop coordinates
  const pickLat = booking.pickupLocation.latitude || 37.7749;
  const pickLng = booking.pickupLocation.longitude || -122.4194;
  const dropLat = booking.dropLocation.latitude || 37.6213;
  const dropLng = booking.dropLocation.longitude || -122.3790;

  const waypoints = [
    { latitude: pickLat, longitude: pickLng },
    { latitude: pickLat + (dropLat - pickLat) * 0.25, longitude: pickLng + (dropLng - pickLng) * 0.25 },
    { latitude: pickLat + (dropLat - pickLat) * 0.5, longitude: pickLng + (dropLng - pickLng) * 0.5 },
    { latitude: pickLat + (dropLat - pickLat) * 0.75, longitude: pickLng + (dropLng - pickLng) * 0.75 },
    { latitude: dropLat, longitude: dropLng },
  ];

  await Tracking.create({
    bookingId: booking._id,
    carId: car._id,
    currentCoordinates: { latitude: pickLat, longitude: pickLng },
    pickupCoordinates: { latitude: pickLat, longitude: pickLng },
    destinationCoordinates: { latitude: dropLat, longitude: dropLng },
    routeWaypoints: waypoints,
    distanceRemainingKm: 24.8,
    estimatedArrivalMins: 32,
    speedKmH: 52,
    headingDeg: 145,
    status: 'in_transit',
  });

  return booking;
};

const getBookingsByUser = async (userId) => {
  return await Booking.find({ userId })
    .populate('carId')
    .sort({ createdAt: -1 });
};

const getAllBookings = async (filter = {}) => {
  return await Booking.find(filter)
    .populate('userId', 'name email phone')
    .populate('carId')
    .sort({ createdAt: -1 });
};

const getBookingById = async (id) => {
  const booking = await Booking.findById(id).populate('carId').populate('userId', 'name email phone');
  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }
  return booking;
};

const verifyBooking = async (identifier) => {
  // Can verify by bookingId or bookingCode
  let booking;
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    booking = await Booking.findById(identifier).populate('carId').populate('userId', 'name email phone');
  } else {
    booking = await Booking.findOne({ bookingCode: identifier }).populate('carId').populate('userId', 'name email phone');
  }

  if (!booking) {
    const error = new Error('Booking not found with the given verification reference.');
    error.statusCode = 404;
    throw error;
  }

  booking.qrVerificationStatus = true;
  booking.verifiedAt = new Date();
  await booking.save();

  return booking;
};

const cancelBooking = async (id, userId, reason = 'Cancelled by user') => {
  const booking = await Booking.findById(id);
  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  // Check authorization
  if (userId && booking.userId.toString() !== userId.toString()) {
    const error = new Error('Unauthorized to cancel this booking.');
    error.statusCode = 403;
    throw error;
  }

  booking.bookingStatus = 'cancelled';
  booking.cancellationReason = reason;
  await booking.save();

  return booking;
};

module.exports = {
  createBooking,
  getBookingsByUser,
  getAllBookings,
  getBookingById,
  verifyBooking,
  cancelBooking,
};
