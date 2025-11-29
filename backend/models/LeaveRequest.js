const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        leaveType: {
            type: String,
            enum: ['sick', 'casual', 'vacation'],
            required: [true, 'Please specify leave type'],
        },
        startDate: {
            type: Date,
            required: [true, 'Please provide start date'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please provide end date'],
        },
        totalDays: {
            type: Number,
            required: true,
            min: 0.5,
        },
        reason: {
            type: String,
            required: [true, 'Please provide a reason for leave'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        managerComment: {
            type: String,
            trim: true,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
leaveRequestSchema.index({ userId: 1, status: 1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
