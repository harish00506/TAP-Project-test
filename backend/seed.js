require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const LeaveRequest = require('./models/LeaveRequest');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await LeaveRequest.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users (password will be hashed by pre-save hook)
    const password = 'password123';

    // Create employees
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john@test.com',
      password,
      role: 'employee',
      isEmailVerified: true,
      leaveBalance: {
        sickLeave: 8,
        casualLeave: 3,
        vacation: 5,
      },
    });

    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@test.com',
      password,
      role: 'employee',
      isEmailVerified: true,
      leaveBalance: {
        sickLeave: 10,
        casualLeave: 5,
        vacation: 3,
      },
    });

    const employee3 = await User.create({
      name: 'Bob Johnson',
      email: 'bob@test.com',
      password,
      role: 'employee',
      isEmailVerified: true,
      leaveBalance: {
        sickLeave: 7,
        casualLeave: 4,
        vacation: 4,
      },
    });

    // Create manager
    const manager = await User.create({
      name: 'Manager Admin',
      email: 'manager@test.com',
      password,
      role: 'manager',
      isEmailVerified: true,
      leaveBalance: {
        sickLeave: 10,
        casualLeave: 5,
        vacation: 5,
      },
    });

    console.log('Created users:');
    console.log('- john@test.com (Employee)');
    console.log('- jane@test.com (Employee)');
    console.log('- bob@test.com (Employee)');
    console.log('- manager@test.com (Manager)');
    console.log('All passwords: password123');

    // Create sample leave requests
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Pending requests
    await LeaveRequest.create({
      userId: employee1._id,
      leaveType: 'sick',
      startDate: tomorrow,
      endDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
      totalDays: 3,
      reason: 'Medical appointment and recovery',
      status: 'pending',
    });

    await LeaveRequest.create({
      userId: employee2._id,
      leaveType: 'vacation',
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000),
      totalDays: 5,
      reason: 'Family vacation trip',
      status: 'pending',
    });

    // Approved requests
    await LeaveRequest.create({
      userId: employee1._id,
      leaveType: 'casual',
      startDate: lastWeek,
      endDate: new Date(lastWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
      totalDays: 2,
      reason: 'Personal work',
      status: 'approved',
      managerComment: 'Approved. Have a good time.',
      approvedBy: manager._id,
      approvedAt: new Date(lastWeek.getTime() - 24 * 60 * 60 * 1000),
    });

    await LeaveRequest.create({
      userId: employee3._id,
      leaveType: 'sick',
      startDate: new Date(lastWeek.getTime() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(lastWeek.getTime() - 2 * 24 * 60 * 60 * 1000),
      totalDays: 1,
      reason: 'Fever and cold',
      status: 'approved',
      managerComment: 'Approved. Get well soon!',
      approvedBy: manager._id,
      approvedAt: new Date(lastWeek.getTime() - 4 * 24 * 60 * 60 * 1000),
    });

    // Rejected request
    await LeaveRequest.create({
      userId: employee2._id,
      leaveType: 'casual',
      startDate: lastWeek,
      endDate: lastWeek,
      totalDays: 0.5,
      reason: 'Half day for personal work',
      status: 'rejected',
      managerComment: 'Cannot approve due to staffing constraints. Please reschedule.',
      approvedBy: manager._id,
      approvedAt: new Date(lastWeek.getTime() - 24 * 60 * 60 * 1000),
    });

    console.log('\nCreated sample leave requests');
    console.log('- 2 pending requests');
    console.log('- 2 approved requests');
    console.log('- 1 rejected request');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('Email: john@test.com or manager@test.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});
