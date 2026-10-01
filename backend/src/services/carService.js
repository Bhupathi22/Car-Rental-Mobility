const Car = require('../models/Car');

const getAllCars = async (query = {}) => {
  const {
    brand,
    vehicleType,
    fuel,
    transmission,
    seats,
    minPrice,
    maxPrice,
    isAvailable,
    search,
    sortBy,
  } = query;

  const filter = {};

  if (brand && brand !== 'All') {
    filter.brand = new RegExp(`^${brand}$`, 'i');
  }

  if (vehicleType && vehicleType !== 'All') {
    filter.vehicleType = vehicleType;
  }

  if (fuel && fuel !== 'All') {
    filter.fuel = fuel;
  }

  if (transmission && transmission !== 'All') {
    filter.transmission = transmission;
  }

  if (seats && seats !== 'All') {
    filter.seats = Number(seats);
  }

  if (isAvailable !== undefined && isAvailable !== '') {
    filter.isAvailable = isAvailable === 'true' || isAvailable === true;
  }

  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { vehicleType: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let sortCriteria = { createdAt: -1 }; // Default newest
  if (sortBy === 'price_asc') {
    sortCriteria = { pricePerDay: 1 };
  } else if (sortBy === 'price_desc') {
    sortCriteria = { pricePerDay: -1 };
  } else if (sortBy === 'popular') {
    sortCriteria = { ratingsAverage: -1, ratingsQuantity: -1 };
  } else if (sortBy === 'newest') {
    sortCriteria = { year: -1, createdAt: -1 };
  }

  const cars = await Car.find(filter).sort(sortCriteria);
  const total = await Car.countDocuments(filter);

  return { cars, total };
};

const getCarById = async (id) => {
  const car = await Car.findById(id);
  if (!car) {
    const error = new Error('Car not found.');
    error.statusCode = 404;
    throw error;
  }
  return car;
};

const createCar = async (carData) => {
  const car = await Car.create(carData);
  return car;
};

const updateCar = async (id, updateData) => {
  const car = await Car.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!car) {
    const error = new Error('Car not found.');
    error.statusCode = 404;
    throw error;
  }
  return car;
};

const deleteCar = async (id) => {
  const car = await Car.findByIdAndDelete(id);
  if (!car) {
    const error = new Error('Car not found.');
    error.statusCode = 404;
    throw error;
  }
  return car;
};

const toggleCarAvailability = async (id, isAvailable) => {
  const car = await Car.findByIdAndUpdate(
    id,
    { isAvailable },
    { new: true }
  );
  if (!car) {
    const error = new Error('Car not found.');
    error.statusCode = 404;
    throw error;
  }
  return car;
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  toggleCarAvailability,
};
