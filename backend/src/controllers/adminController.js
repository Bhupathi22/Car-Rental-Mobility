const adminService = require('../services/adminService');

const getDashboard = async (req, res, next) => {
  try {
    const analytics = await adminService.getDashboardAnalytics();
    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    next(err);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const customers = await adminService.getAllCustomers();
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getCustomers,
};
