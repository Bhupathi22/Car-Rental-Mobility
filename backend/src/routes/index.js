const express = require('express');
const authRoutes = require('./authRoutes');
const carRoutes = require('./carRoutes');
const bookingRoutes = require('./bookingRoutes');
const paymentRoutes = require('./paymentRoutes');
const trackingRoutes = require('./trackingRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const reviewRoutes = require('./reviewRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Health Check API (CO6 requirement)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Car Rental & Mobility',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/tracking', trackingRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
