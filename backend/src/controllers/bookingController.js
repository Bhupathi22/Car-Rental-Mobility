const bookingService = require('../services/bookingService');
const { logActivity } = require('../utils/logger');

const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking({
      userId: req.user._id,
      carId: req.body.carId,
      customerInfo: {
        name: req.user.name,
        email: req.user.email,
        phone: req.body.phone || req.user.phone,
      },
      pickupDate: req.body.pickupDate,
      returnDate: req.body.returnDate,
      pickupLocation: req.body.pickupLocation,
      dropLocation: req.body.dropLocation,
    });

    await logActivity({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'CUSTOMER_CREATE_BOOKING',
      module: 'BOOKING',
      details: { bookingId: booking._id, bookingCode: booking.bookingCode, totalAmount: booking.totalAmount },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully with unique verification QR.',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getBookingsByUser(req.user._id);
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.bookingStatus = req.query.status;
    }
    const bookings = await bookingService.getAllBookings(filter);
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    // If customer, ensure customer owns booking
    if (req.user.role === 'CUSTOMER' && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this booking record.',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

const verifyBooking = async (req, res, next) => {
  try {
    const identifier = req.params.identifier;
    const booking = await bookingService.verifyBooking(identifier);

    await logActivity({
      userId: req.user ? req.user._id : null,
      userEmail: req.user ? req.user.email : 'public-verifier',
      action: 'QR_BOOKING_VERIFIED',
      module: 'BOOKING',
      details: { bookingId: booking._id, bookingCode: booking.bookingCode },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Booking successfully verified! Booking found, customer verified, vehicle verified.',
      data: {
        bookingId: booking._id,
        bookingCode: booking.bookingCode,
        customerName: booking.customerInfo.name,
        customerEmail: booking.customerInfo.email,
        vehicleBrand: booking.vehicleInfo.brand,
        vehicleModel: booking.vehicleInfo.model,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        pickupLocation: booking.pickupLocation.name,
        dropLocation: booking.dropLocation.name,
        totalAmount: booking.totalAmount,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        qrVerificationStatus: booking.qrVerificationStatus,
        verifiedAt: booking.verifiedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user.role === 'ADMIN' ? null : req.user._id,
      req.body.reason
    );

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBooking,
  verifyBooking,
  cancelBooking,
};
