const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyRequests,
    cancelLeaveRequest,
    getLeaveBalance,
    getAllRequests,
    getPendingRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
} = require('../controllers/leaveController');
const { protect, verifyEmail, authorize } = require('../middleware/auth');

// Employee routes
router.post('/', protect, verifyEmail, applyLeave);
router.get('/my-requests', protect, verifyEmail, getMyRequests);
router.delete('/:id', protect, verifyEmail, cancelLeaveRequest);
router.get('/balance', protect, verifyEmail, getLeaveBalance);

// Manager routes
router.get('/all', protect, verifyEmail, authorize('manager'), getAllRequests);
router.get('/pending', protect, verifyEmail, authorize('manager'), getPendingRequests);
router.put('/:id/approve', protect, verifyEmail, authorize('manager'), approveLeaveRequest);
router.put('/:id/reject', protect, verifyEmail, authorize('manager'), rejectLeaveRequest);

module.exports = router;
