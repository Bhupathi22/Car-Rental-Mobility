const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBooking,
  verifyBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

// Public / Scanning verification route
router.get('/verify/:identifier', verifyBooking);

// Protected routes
router.post(
  '/',
  protect,
  authorize('CUSTOMER'),
  [
    body('carId').isMongoId().withMessage('Valid carId is required'),
    body('pickupDate').notEmpty().withMessage('Pickup date is required'),
    body('returnDate').notEmpty().withMessage('Return date is required'),
    validateRequest,
  ],
  createBooking
);

router.get('/my', protect, authorize('CUSTOMER'), getMyBookings);
router.get('/', protect, authorize('ADMIN'), getAllBookings);
router.get('/:id', protect, getBooking);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
