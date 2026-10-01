const reviewService = require('../services/reviewService');

const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getCarReviews(req.params.carId);
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { carId, rating, title, comment } = req.body;
    const review = await reviewService.createReview({
      carId,
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      rating,
      title,
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReviews,
  createReview,
};
