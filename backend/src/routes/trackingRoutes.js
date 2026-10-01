const express = require('express');
const { getTracking, updateTracking } = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:bookingId', protect, getTracking);
router.put('/:bookingId/simulate', protect, updateTracking);

module.exports = router;
