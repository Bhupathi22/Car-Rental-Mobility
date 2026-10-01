const carService = require('../services/carService');
const { logActivity } = require('../utils/logger');

const getCars = async (req, res, next) => {
  try {
    const result = await carService.getAllCars(req.query);
    res.status(200).json({
      success: true,
      count: result.cars.length,
      total: result.total,
      data: result.cars,
    });
  } catch (err) {
    next(err);
  }
};

const getCar = async (req, res, next) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (err) {
    next(err);
  }
};

const createCar = async (req, res, next) => {
  try {
    const carData = { ...req.body };

    // If features sent as comma string, convert to array
    if (typeof carData.features === 'string') {
      try {
        carData.features = JSON.parse(carData.features);
      } catch (e) {
        carData.features = carData.features.split(',').map((f) => f.trim());
      }
    }

    // If locations sent as string, parse
    if (typeof carData.pickupLocation === 'string') {
      try {
        carData.pickupLocation = JSON.parse(carData.pickupLocation);
      } catch (e) {}
    }
    if (typeof carData.dropLocation === 'string') {
      try {
        carData.dropLocation = JSON.parse(carData.dropLocation);
      } catch (e) {}
    }

    // Handle uploaded files if any
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((file) => `/uploads/${file.filename}`);
      carData.images = Array.isArray(carData.images)
        ? [...carData.images, ...uploadedUrls]
        : uploadedUrls;
    } else if (typeof carData.images === 'string') {
      try {
        carData.images = JSON.parse(carData.images);
      } catch (e) {
        carData.images = [carData.images];
      }
    }

    // Default image fallback if none provided
    if (!carData.images || carData.images.length === 0) {
      carData.images = [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      ];
    }

    const car = await carService.createCar(carData);

    await logActivity({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'ADMIN_CREATE_CAR',
      module: 'CAR',
      details: { carId: car._id, brand: car.brand, model: car.model },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully and published to catalog.',
      data: car,
    });
  } catch (err) {
    next(err);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (e) {
        updateData.features = updateData.features.split(',').map((f) => f.trim());
      }
    }

    if (typeof updateData.pickupLocation === 'string') {
      try {
        updateData.pickupLocation = JSON.parse(updateData.pickupLocation);
      } catch (e) {}
    }
    if (typeof updateData.dropLocation === 'string') {
      try {
        updateData.dropLocation = JSON.parse(updateData.dropLocation);
      } catch (e) {}
    }

    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((file) => `/uploads/${file.filename}`);
      updateData.images = Array.isArray(updateData.images)
        ? [...updateData.images, ...uploadedUrls]
        : uploadedUrls;
    }

    const car = await carService.updateCar(req.params.id, updateData);

    await logActivity({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'ADMIN_UPDATE_CAR',
      module: 'CAR',
      details: { carId: car._id, brand: car.brand, model: car.model },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle specifications updated successfully.',
      data: car,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const car = await carService.deleteCar(req.params.id);

    await logActivity({
      userId: req.user._id,
      userEmail: req.user.email,
      action: 'ADMIN_DELETE_CAR',
      module: 'CAR',
      details: { carId: req.params.id, brand: car.brand, model: car.model },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Vehicle removed from fleet catalog.',
      data: car,
    });
  } catch (err) {
    next(err);
  }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const car = await carService.toggleCarAvailability(req.params.id, isAvailable);
    res.status(200).json({
      success: true,
      message: `Vehicle status changed to ${isAvailable ? 'Available' : 'Unavailable'}.`,
      data: car,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  toggleAvailability,
};
