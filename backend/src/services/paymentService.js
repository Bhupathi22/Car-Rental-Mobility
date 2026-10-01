const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { logActivity } = require('../utils/logger');

const processPayment = async ({
  bookingId,
  userId,
  amount,
  paymentMethod = 'demo_card',
  cardDetails,
  upiId,
  req,
}) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  if (booking.paymentStatus === 'paid') {
    const error = new Error('This booking has already been paid for.');
    error.statusCode = 400;
    throw error;
  }

  // Generate simulated unique transaction identifier
  const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Record payment in MongoDB
  const payment = await Payment.create({
    bookingId: booking._id,
    userId,
    amount: amount || booking.totalAmount,
    currency: 'USD',
    paymentMethod,
    transactionId,
    status: 'completed',
    gatewayResponse: {
      gateway: 'Demo Mobility Gateway',
      method: paymentMethod,
      upiId: upiId || null,
      cardLast4: cardDetails?.cardNumber ? cardDetails.cardNumber.slice(-4) : '4242',
      processedAt: new Date().toISOString(),
      authorized: true,
    },
    paidAt: new Date(),
  });

  // Update booking state in MongoDB
  booking.paymentStatus = 'paid';
  booking.bookingStatus = 'confirmed';
  await booking.save();

  await logActivity({
    userId,
    userEmail: booking.customerInfo?.email,
    action: 'PAYMENT_PROCESSED',
    module: 'PAYMENT',
    details: { bookingId: booking._id, amount: payment.amount, transactionId },
    req,
  });

  return { payment, booking };
};

const getPaymentByBookingId = async (bookingId) => {
  return await Payment.findOne({ bookingId }).populate('bookingId');
};

const getAllPayments = async () => {
  return await Payment.find().populate('userId', 'name email').populate('bookingId').sort({ createdAt: -1 });
};

module.exports = {
  processPayment,
  getPaymentByBookingId,
  getAllPayments,
};
