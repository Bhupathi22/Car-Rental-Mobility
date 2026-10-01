const Review = require('../models/Review');
const Car = require('../models/Car');

const getCarReviews = async (carId) => {
  return await Review.find({ carId }).populate('userId', 'name avatar').sort({ createdAt: -1 });
};

const createReview = async ({ carId, userId, userName, userAvatar, rating, title, comment }) => {
  const car = await Car.findById(carId);
  if (!car) {
    const error = new Error('Car not found.');
    error.statusCode = 404;
    throw error;
  }

  const review = await Review.create({
    carId,
    userId,
    userName,
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: Number(rating),
    title,
    comment,
  });

  return review;
};

module.exports = {
  getCarReviews,
  createReview,
};
