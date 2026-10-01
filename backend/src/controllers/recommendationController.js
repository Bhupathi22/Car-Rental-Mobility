const recommendationService = require('../services/recommendationService');

const getRecommendations = async (req, res, next) => {
  try {
    const { purpose, passengers, budget, preferredFuel, transmission, vehicleType } = req.query;

    const recommendations = await recommendationService.generateRecommendations({
      userId: req.user ? req.user._id : null,
      purpose,
      passengers,
      budget,
      preferredFuel,
      transmission,
      vehicleType,
    });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendations,
};
