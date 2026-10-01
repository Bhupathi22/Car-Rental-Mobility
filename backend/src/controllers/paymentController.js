const paymentService = require('../services/paymentService');

const createPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, paymentMethod, cardDetails, upiId } = req.body;

    const result = await paymentService.processPayment({
      bookingId,
      userId: req.user._id,
      amount,
      paymentMethod,
      cardDetails,
      upiId,
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully! Booking confirmed.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByBookingId(req.params.bookingId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No payment record found for this booking.',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
  getPaymentByBooking,
  getAllPayments,
};
