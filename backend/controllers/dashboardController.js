const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
const getEmployeeDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user with leave balance
        const user = await User.findById(userId);

        // Get all leave requests
        const allRequests = await LeaveRequest.find({ userId });

        // Calculate stats
        const stats = {
            totalLeavesTaken: 0,
            leavesByType: {
                sick: 0,
                casual: 0,
                vacation: 0,
            },
            leavesByStatus: {
                pending: 0,
                approved: 0,
                rejected: 0,
            },
        };

        allRequests.forEach(request => {
            if (request.status === 'approved') {
                stats.totalLeavesTaken += request.totalDays;
                stats.leavesByType[request.leaveType] += request.totalDays;
            }
            stats.leavesByStatus[request.status]++;
        });

        // Get upcoming approved leaves
        const upcomingLeaves = await LeaveRequest.find({
            userId,
            status: 'approved',
            startDate: { $gte: new Date() },
        })
            .sort({ startDate: 1 })
            .limit(5);

        // Get monthly leave trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await LeaveRequest.aggregate([
            {
                $match: {
                    userId: user._id,
                    status: 'approved',
                    startDate: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$startDate' },
                        month: { $month: '$startDate' },
                    },
                    totalDays: { $sum: '$totalDays' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        // Format monthly trend
        const formattedMonthlyTrend = monthlyTrend.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            totalDays: item.totalDays,
            count: item.count,
        }));

        // Get recent requests
        const recentRequests = await LeaveRequest.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                leaveBalance: user.leaveBalance,
                stats,
                upcomingLeaves,
                monthlyTrend: formattedMonthlyTrend,
                recentRequests,
            },
        });
    } catch (error) {
        console.error('Get employee dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message,
        });
    }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
const getManagerDashboard = async (req, res) => {
    try {
        // Get total pending requests
        const pendingCount = await LeaveRequest.countDocuments({ status: 'pending' });

        // Get leaves approved today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const approvedToday = await LeaveRequest.countDocuments({
            status: 'approved',
            approvedAt: { $gte: today, $lt: tomorrow },
        });

        // Get leaves approved this month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const approvedThisMonth = await LeaveRequest.countDocuments({
            status: 'approved',
            approvedAt: { $gte: startOfMonth },
        });

        // Get team leave usage by type
        const leavesByType = await LeaveRequest.aggregate([
            {
                $match: { status: 'approved' },
            },
            {
                $group: {
                    _id: '$leaveType',
                    totalDays: { $sum: '$totalDays' },
                    count: { $sum: 1 },
                },
            },
        ]);

        const formattedLeavesByType = {
            sick: 0,
            casual: 0,
            vacation: 0,
        };

        leavesByType.forEach(item => {
            formattedLeavesByType[item._id] = item.totalDays;
        });

        // Get monthly team leave trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await LeaveRequest.aggregate([
            {
                $match: {
                    status: 'approved',
                    startDate: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$startDate' },
                        month: { $month: '$startDate' },
                    },
                    totalDays: { $sum: '$totalDays' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        // Format monthly trend
        const formattedMonthlyTrend = monthlyTrend.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            totalDays: item.totalDays,
            count: item.count,
        }));

        // Get total employees
        const totalEmployees = await User.countDocuments({ role: 'employee' });

        // Get recent pending requests
        const recentPendingRequests = await LeaveRequest.find({ status: 'pending' })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get leave distribution by status
        const leavesByStatus = await LeaveRequest.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const formattedLeavesByStatus = {
            pending: 0,
            approved: 0,
            rejected: 0,
        };

        leavesByStatus.forEach(item => {
            formattedLeavesByStatus[item._id] = item.count;
        });

        // Get top employees by leave usage
        const topEmployees = await LeaveRequest.aggregate([
            {
                $match: { status: 'approved' },
            },
            {
                $group: {
                    _id: '$userId',
                    totalDays: { $sum: '$totalDays' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { totalDays: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        // Populate employee details
        const topEmployeesWithDetails = await User.populate(topEmployees, {
            path: '_id',
            select: 'name email',
        });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    pendingCount,
                    approvedToday,
                    approvedThisMonth,
                    totalEmployees,
                },
                leavesByType: formattedLeavesByType,
                leavesByStatus: formattedLeavesByStatus,
                monthlyTrend: formattedMonthlyTrend,
                recentPendingRequests,
                topEmployees: topEmployeesWithDetails,
            },
        });
    } catch (error) {
        console.error('Get manager dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message,
        });
    }
};

module.exports = {
    getEmployeeDashboard,
    getManagerDashboard,
};
