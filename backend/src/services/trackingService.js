const Tracking = require('../models/Tracking');
const Booking = require('../models/Booking');

const getTrackingByBooking = async (bookingId) => {
  let tracking = await Tracking.findOne({ bookingId }).populate('carId');
  if (!tracking) {
    // If not created yet, create on the fly from booking
    const booking = await Booking.findById(bookingId).populate('carId');
    if (!booking) {
      const error = new Error('Booking not found for tracking.');
      error.statusCode = 404;
      throw error;
    }

    const pickLat = booking.pickupLocation?.latitude || 37.7749;
    const pickLng = booking.pickupLocation?.longitude || -122.4194;
    const dropLat = booking.dropLocation?.latitude || 37.6213;
    const dropLng = booking.dropLocation?.longitude || -122.3790;

    const waypoints = [
      { latitude: pickLat, longitude: pickLng },
      { latitude: pickLat + (dropLat - pickLat) * 0.25, longitude: pickLng + (dropLng - pickLng) * 0.25 },
      { latitude: pickLat + (dropLat - pickLat) * 0.5, longitude: pickLng + (dropLng - pickLng) * 0.5 },
      { latitude: pickLat + (dropLat - pickLat) * 0.75, longitude: pickLng + (dropLng - pickLng) * 0.75 },
      { latitude: dropLat, longitude: dropLng },
    ];

    tracking = await Tracking.create({
      bookingId: booking._id,
      carId: booking.carId._id,
      currentCoordinates: { latitude: pickLat, longitude: pickLng },
      pickupCoordinates: { latitude: pickLat, longitude: pickLng },
      destinationCoordinates: { latitude: dropLat, longitude: dropLng },
      routeWaypoints: waypoints,
      distanceRemainingKm: 24.8,
      estimatedArrivalMins: 32,
      speedKmH: 48,
      headingDeg: 135,
      status: 'in_transit',
    });
    tracking = await Tracking.findById(tracking._id).populate('carId');
  }

  return tracking;
};

/**
 * Simulates real-time vehicle movement towards destination
 */
const advanceTrackingSimulation = async (bookingId) => {
  const tracking = await Tracking.findOne({ bookingId }).populate('carId');
  if (!tracking) {
    const error = new Error('Tracking telemetry not found.');
    error.statusCode = 404;
    throw error;
  }

  const { pickupCoordinates, destinationCoordinates, currentCoordinates } = tracking;

  // Calculate delta step (simulating moving 10% closer on each simulation ping)
  const deltaLat = (destinationCoordinates.latitude - pickupCoordinates.latitude) * 0.08;
  const deltaLng = (destinationCoordinates.longitude - pickupCoordinates.longitude) * 0.08;

  let newLat = currentCoordinates.latitude + deltaLat;
  let newLng = currentCoordinates.longitude + deltaLng;

  // Calculate distance to destination
  const distSq = Math.pow(newLat - destinationCoordinates.latitude, 2) + Math.pow(newLng - destinationCoordinates.longitude, 2);

  if (distSq < 0.0001) {
    // Arrived
    newLat = destinationCoordinates.latitude;
    newLng = destinationCoordinates.longitude;
    tracking.status = 'arrived';
    tracking.distanceRemainingKm = 0;
    tracking.estimatedArrivalMins = 0;
    tracking.speedKmH = 0;
  } else {
    tracking.status = 'in_transit';
    tracking.distanceRemainingKm = Math.max(0.5, Math.round((tracking.distanceRemainingKm - 1.8) * 10) / 10);
    tracking.estimatedArrivalMins = Math.max(1, Math.round(tracking.estimatedArrivalMins - 2));
    tracking.speedKmH = Math.floor(40 + Math.random() * 20); // fluctuate between 40-60 km/h
  }

  tracking.currentCoordinates = { latitude: newLat, longitude: newLng };
  tracking.lastUpdated = new Date();

  await tracking.save();
  return tracking;
};

module.exports = {
  getTrackingByBooking,
  advanceTrackingSimulation,
};
