const trackingService = require('../services/trackingService');

const getTracking = async (req, res, next) => {
  try {
    const tracking = await trackingService.getTrackingByBooking(req.params.bookingId);
    res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (err) {
    next(err);
  }
};

const updateTracking = async (req, res, next) => {
  try {
    const tracking = await trackingService.advanceTrackingSimulation(req.params.bookingId);
    res.status(200).json({
      success: true,
      message: 'Vehicle coordinates updated along route.',
      data: tracking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTracking,
  updateTracking,
};
