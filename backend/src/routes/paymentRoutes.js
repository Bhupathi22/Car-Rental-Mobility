const express = require('express');
const { body } = require('express-validator');
const {
  createPayment,
  getPaymentByBooking,
  getAllPayments,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('bookingId').isMongoId().withMessage('Valid bookingId is required'),
    validateRequest,
  ],
  createPayment
);

router.get('/booking/:bookingId', protect, getPaymentByBooking);
router.get('/', protect, authorize('ADMIN'), getAllPayments);

module.exports = router;
