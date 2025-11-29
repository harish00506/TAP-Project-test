const express = require('express');
const router = express.Router();
const {
    getEmployeeDashboard,
    getManagerDashboard,
} = require('../controllers/dashboardController');
const { protect, verifyEmail, authorize } = require('../middleware/auth');

// Employee dashboard
router.get('/employee', protect, verifyEmail, getEmployeeDashboard);

// Manager dashboard
router.get('/manager', protect, verifyEmail, authorize('manager'), getManagerDashboard);

module.exports = router;
