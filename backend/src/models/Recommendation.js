const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    criteria: {
      purpose: {
        type: String,
        enum: ['Family', 'Business', 'Travel', 'Luxury', 'Budget', 'Adventure'],
        required: true,
      },
      passengers: {
        type: Number,
        required: true,
      },
      budget: {
        type: Number,
        required: true,
      },
      preferredFuel: {
        type: String,
        default: 'Any',
      },
      transmission: {
        type: String,
        default: 'Any',
      },
      vehicleType: {
        type: String,
        default: 'Any',
      },
    },
    recommendations: [
      {
        car: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Car',
        },
        score: Number,
        reason: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
