const Car = require('../models/Car');
const Recommendation = require('../models/Recommendation');

const generateRecommendations = async ({
  userId = null,
  purpose = 'Travel',
  passengers = 4,
  budget = 150,
  preferredFuel = 'Any',
  transmission = 'Any',
  vehicleType = 'Any',
}) => {
  const cars = await Car.find({ isAvailable: true });

  const scoredCars = cars.map((car) => {
    let score = 50; // Base score
    const matchReasons = [];

    // Passenger Capacity Match
    if (car.seats >= Number(passengers)) {
      score += 25;
      matchReasons.push(`comfortably accommodates ${car.seats} passengers`);
    } else {
      score -= 30;
    }

    // Budget Compatibility
    if (car.pricePerDay <= Number(budget)) {
      score += 25;
      matchReasons.push(`fits within your daily budget of $${budget} (at $${car.pricePerDay}/day)`);
    } else if (car.pricePerDay <= Number(budget) * 1.25) {
      score += 5; // Close to budget
    } else {
      score -= 20;
    }

    // Vehicle Type Match
    if (vehicleType !== 'Any' && car.vehicleType.toLowerCase() === vehicleType.toLowerCase()) {
      score += 20;
      matchReasons.push(`matches your requested ${car.vehicleType} category`);
    }

    // Purpose-Driven Heuristics
    if (purpose === 'Family' && (car.vehicleType === 'SUV' || car.seats >= 5)) {
      score += 20;
      matchReasons.push('spacious interior optimized for family comfort and cargo');
    } else if (purpose === 'Business' && (car.vehicleType === 'Luxury' || car.vehicleType === 'Sedan')) {
      score += 20;
      matchReasons.push('executive styling and quiet cabin ideal for business trips');
    } else if (purpose === 'Luxury' && car.vehicleType === 'Luxury') {
      score += 25;
      matchReasons.push('flagship luxury appointments and performance');
    } else if (purpose === 'Budget' && car.pricePerDay <= 75) {
      score += 20;
      matchReasons.push('highly economical rental rate with great mileage');
    } else if (purpose === 'Adventure' && (car.vehicleType === 'SUV' || car.features.includes('All-Wheel Drive'))) {
      score += 20;
      matchReasons.push('rugged all-terrain capability engineered for adventures');
    } else if (purpose === 'Travel' && (car.fuel === 'Electric' || car.fuel === 'Hybrid')) {
      score += 15;
      matchReasons.push('high fuel efficiency for extended touring');
    }

    // Fuel Preference Match
    if (preferredFuel !== 'Any' && car.fuel.toLowerCase() === preferredFuel.toLowerCase()) {
      score += 10;
      matchReasons.push(`powers via your preferred ${car.fuel} drivetrain`);
    }

    // Transmission Match
    if (transmission !== 'Any' && car.transmission.toLowerCase() === transmission.toLowerCase()) {
      score += 10;
      matchReasons.push(`features ${car.transmission} transmission`);
    }

    // Ratings bonus
    if (car.ratingsAverage >= 4.7) {
      score += 10;
    }

    const reason = `Recommended because this vehicle ${matchReasons.join(', ')}.`;

    return {
      car,
      score: Math.min(100, Math.max(10, score)),
      reason,
    };
  });

  // Sort by highest recommendation score
  scoredCars.sort((a, b) => b.score - a.score);

  const topRecommendations = scoredCars.slice(0, 6);

  // Persist query to MongoDB Recommendation model
  try {
    await Recommendation.create({
      userId,
      criteria: {
        purpose,
        passengers: Number(passengers),
        budget: Number(budget),
        preferredFuel,
        transmission,
        vehicleType,
      },
      recommendations: topRecommendations.map((r) => ({
        car: r.car._id,
        score: r.score,
        reason: r.reason,
      })),
    });
  } catch (err) {
    console.warn('Failed to persist recommendation query:', err.message);
  }

  return topRecommendations;
};

module.exports = { generateRecommendations };
