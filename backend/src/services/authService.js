const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'car_rental_mobility_super_secret_jwt_key_2025_academics', {
    expiresIn: '30d',
  });
};

const registerUser = async ({ name, email, password, role = 'CUSTOMER', phone, address }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with this email address already exists.');
    error.statusCode = 400;
    throw error;
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
    phone: phone || '+1 (555) 019-2834',
    address: address || '100 Mobility Way, Tech Valley',
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    token: generateToken(user._id),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    token: generateToken(user._id),
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  delete updateData.password;
  delete updateData.role; // Prevent privilege escalation

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
