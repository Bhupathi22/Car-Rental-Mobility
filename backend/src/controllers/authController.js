const authService = require('../services/authService');
const { logActivity } = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    await logActivity({
      userId: user._id,
      userEmail: user.email,
      action: 'USER_REGISTER',
      module: 'AUTH',
      details: { role: user.role },
      req,
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);

    await logActivity({
      userId: user._id,
      userEmail: user.email,
      action: 'USER_LOGIN',
      module: 'AUTH',
      details: { role: user.role },
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const user = await authService.updateUserProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
};
