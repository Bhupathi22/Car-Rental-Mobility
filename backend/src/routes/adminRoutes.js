const express = require('express');
const { getDashboard, getCustomers } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', getDashboard);
router.get('/customers', getCustomers);

module.exports = router;
