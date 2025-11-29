const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');
const { protect, verifyEmail } = require('../middleware/auth');

router.get('/', protect, verifyEmail, getNotifications);
router.put('/:id/read', protect, verifyEmail, markAsRead);
router.put('/mark-all-read', protect, verifyEmail, markAllAsRead);

module.exports = router;
