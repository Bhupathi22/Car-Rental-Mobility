const express = require('express');
const { body } = require('express-validator');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  toggleAvailability,
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCar);

// Admin Only Routes
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  upload.array('images', 5),
  [
    body('brand').notEmpty().withMessage('Vehicle brand is required'),
    body('model').notEmpty().withMessage('Vehicle model is required'),
    body('year').isInt({ min: 2010 }).withMessage('Year must be 2010 or newer'),
    body('pricePerDay').isFloat({ min: 1 }).withMessage('Valid price per day is required'),
    body('seats').isInt({ min: 2 }).withMessage('Valid seat count is required'),
    validateRequest,
  ],
  createCar
);

router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  upload.array('images', 5),
  updateCar
);

router.delete('/:id', protect, authorize('ADMIN'), deleteCar);

router.patch('/:id/availability', protect, authorize('ADMIN'), toggleAvailability);

module.exports = router;
