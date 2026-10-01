const express = require('express');
const { body } = require('express-validator');
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/:carId', getReviews);

router.post(
  '/',
  protect,
  [
    body('carId').isMongoId().withMessage('Valid carId is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').trim().notEmpty().withMessage('Review title is required'),
    body('comment').trim().notEmpty().withMessage('Review commentary is required'),
    validateRequest,
  ],
  createReview
);

module.exports = router;
