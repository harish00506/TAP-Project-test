const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { leaveRequestValidation, managerActionValidation } = require('../middleware/validation');
const { sendLeaveApplicationEmail, sendLeaveStatusEmail } = require('../utils/emailService');

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
// @access  Private (Employee)
const applyLeave = async (req, res) => {
  try {
    // Validate request body
    const { error } = leaveRequestValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    // Check if user has sufficient leave balance
    const user = await User.findById(req.user.id);
    const leaveBalanceKey = `${leaveType}Leave`;
    
    if (user.leaveBalance[leaveBalanceKey] < totalDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance. Available: ${user.leaveBalance[leaveBalanceKey]} days`,
      });
    }

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    // Populate user details for response
    await leaveRequest.populate('userId', 'name email');

    // Send email notification to manager
    try {
      const managers = await User.find({ role: 'manager' });
      const managerEmail = managers.length > 0 ? managers[0].email : process.env.DEFAULT_MANAGER_EMAIL;
      
      if (managerEmail) {
        await sendLeaveApplicationEmail(managerEmail, user.name, {
          leaveType,
          startDate,
          endDate,
          totalDays,
          reason,
        });
      }

      // Create notification for managers
      for (const manager of managers) {
        await Notification.create({
          userId: manager._id,
          type: 'leave_applied',
          message: `${user.name} has applied for ${leaveType} leave`,
          leaveRequestId: leaveRequest._id,
        });
      }
    } catch (emailError) {
      console.error('Failed to send notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: {
        leaveRequest,
      },
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting leave request',
      error: error.message,
    });
  }
};

// @desc    Get my leave requests (Employee)
// @route   GET /api/leaves/my-requests
// @access  Private (Employee)
const getMyRequests = async (req, res) => {
  try {
    const { status, leaveType, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { userId: req.user.id };
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;

    // Pagination
    const skip = (page - 1) * limit;

    const leaveRequests = await LeaveRequest.find(query)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await LeaveRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        leaveRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests',
      error: error.message,
    });
  }
};

// @desc    Cancel leave request (Employee)
// @route   DELETE /api/leaves/:id
// @access  Private (Employee)
const cancelLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    // Check if the leave request belongs to the user
    if (leaveRequest.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this leave request',
      });
    }

    // Check if request is still pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${leaveRequest.status} leave request`,
      });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling leave request',
      error: error.message,
    });
  }
};

// @desc    Get leave balance (Employee)
// @route   GET /api/leaves/balance
// @access  Private (Employee)
const getLeaveBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    console.error('Get leave balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave balance',
      error: error.message,
    });
  }
};

// @desc    Get all leave requests (Manager)
// @route   GET /api/leaves/all
// @access  Private (Manager)
const getAllRequests = async (req, res) => {
  try {
    const { status, leaveType, employeeName, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    let leaveRequests = await LeaveRequest.find(query)
      .populate('userId', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Filter by employee name if provided
    if (employeeName) {
      leaveRequests = leaveRequests.filter(req => 
        req.userId.name.toLowerCase().includes(employeeName.toLowerCase())
      );
    }

    const total = await LeaveRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        leaveRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave requests',
      error: error.message,
    });
  }
};

// @desc    Get pending leave requests (Manager)
// @route   GET /api/leaves/pending
// @access  Private (Manager)
const getPendingRequests = async (req, res) => {
  try {
    const { employeeName, leaveType, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { status: 'pending' };
    if (leaveType) query.leaveType = leaveType;

    // Pagination
    const skip = (page - 1) * limit;

    let leaveRequests = await LeaveRequest.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Filter by employee name if provided
    if (employeeName) {
      leaveRequests = leaveRequests.filter(req => 
        req.userId.name.toLowerCase().includes(employeeName.toLowerCase())
      );
    }

    const total = await LeaveRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        leaveRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests',
      error: error.message,
    });
  }
};

// @desc    Approve leave request (Manager)
// @route   PUT /api/leaves/:id/approve
// @access  Private (Manager)
const approveLeaveRequest = async (req, res) => {
  try {
    const { managerComment } = req.body;

    const leaveRequest = await LeaveRequest.findById(req.params.id).populate('userId', 'name email leaveBalance');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Leave request is already ${leaveRequest.status}`,
      });
    }

    // Update leave request
    leaveRequest.status = 'approved';
    leaveRequest.managerComment = managerComment || 'Approved';
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.approvedAt = new Date();
    await leaveRequest.save();

    // Deduct leave balance from user
    const user = await User.findById(leaveRequest.userId._id);
    const leaveBalanceKey = `${leaveRequest.leaveType}Leave`;
    user.leaveBalance[leaveBalanceKey] -= leaveRequest.totalDays;
    await user.save();

    // Send email notification to employee
    try {
      await sendLeaveStatusEmail(
        leaveRequest.userId.email,
        leaveRequest.userId.name,
        {
          leaveType: leaveRequest.leaveType,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          totalDays: leaveRequest.totalDays,
        },
        'approved',
        managerComment
      );

      // Create notification for employee
      await Notification.create({
        userId: leaveRequest.userId._id,
        type: 'leave_approved',
        message: `Your ${leaveRequest.leaveType} leave request has been approved`,
        leaveRequestId: leaveRequest._id,
      });
    } catch (emailError) {
      console.error('Failed to send notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      data: {
        leaveRequest,
      },
    });
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving leave request',
      error: error.message,
    });
  }
};

// @desc    Reject leave request (Manager)
// @route   PUT /api/leaves/:id/reject
// @access  Private (Manager)
const rejectLeaveRequest = async (req, res) => {
  try {
    const { error } = managerActionValidation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { managerComment } = req.body;

    const leaveRequest = await LeaveRequest.findById(req.params.id).populate('userId', 'name email');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found',
      });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Leave request is already ${leaveRequest.status}`,
      });
    }

    // Update leave request
    leaveRequest.status = 'rejected';
    leaveRequest.managerComment = managerComment;
    leaveRequest.approvedBy = req.user.id;
    leaveRequest.approvedAt = new Date();
    await leaveRequest.save();

    // Send email notification to employee
    try {
      await sendLeaveStatusEmail(
        leaveRequest.userId.email,
        leaveRequest.userId.name,
        {
          leaveType: leaveRequest.leaveType,
          startDate: leaveRequest.startDate,
          endDate: leaveRequest.endDate,
          totalDays: leaveRequest.totalDays,
        },
        'rejected',
        managerComment
      );

      // Create notification for employee
      await Notification.create({
        userId: leaveRequest.userId._id,
        type: 'leave_rejected',
        message: `Your ${leaveRequest.leaveType} leave request has been rejected`,
        leaveRequestId: leaveRequest._id,
      });
    } catch (emailError) {
      console.error('Failed to send notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully',
      data: {
        leaveRequest,
      },
    });
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting leave request',
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getMyRequests,
  cancelLeaveRequest,
  getLeaveBalance,
  getAllRequests,
  getPendingRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
};
