const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send verification email
const sendVerificationEmail = async (email, name, verificationToken) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"ELS - Employee Leave System" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Employee Leave Management System!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send leave application notification to manager
const sendLeaveApplicationEmail = async (managerEmail, employeeName, leaveDetails) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ELS - Employee Leave System" <${process.env.EMAIL_FROM}>`,
    to: managerEmail,
    subject: `New Leave Request from ${employeeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Leave Request</h2>
        <p>A new leave request has been submitted:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Employee:</strong> ${employeeName}</p>
          <p><strong>Leave Type:</strong> ${leaveDetails.leaveType}</p>
          <p><strong>Start Date:</strong> ${new Date(leaveDetails.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(leaveDetails.endDate).toLocaleDateString()}</p>
          <p><strong>Total Days:</strong> ${leaveDetails.totalDays}</p>
          <p><strong>Reason:</strong> ${leaveDetails.reason}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/manager/pending-requests" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Review Request
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Leave application email sent to manager:', managerEmail);
  } catch (error) {
    console.error('Error sending leave application email:', error);
    // Don't throw error - notification failure shouldn't block the request
  }
};

// Send leave status update to employee
const sendLeaveStatusEmail = async (employeeEmail, employeeName, leaveDetails, status, managerComment) => {
  const transporter = createTransporter();
  const statusColor = status === 'approved' ? '#10B981' : '#EF4444';
  const statusText = status === 'approved' ? 'Approved' : 'Rejected';

  const mailOptions = {
    from: `"ELS - Employee Leave System" <${process.env.EMAIL_FROM}>`,
    to: employeeEmail,
    subject: `Leave Request ${statusText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColor};">Leave Request ${statusText}</h2>
        <p>Hi ${employeeName},</p>
        <p>Your leave request has been <strong style="color: ${statusColor};">${statusText.toLowerCase()}</strong>.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Leave Type:</strong> ${leaveDetails.leaveType}</p>
          <p><strong>Start Date:</strong> ${new Date(leaveDetails.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${new Date(leaveDetails.endDate).toLocaleDateString()}</p>
          <p><strong>Total Days:</strong> ${leaveDetails.totalDays}</p>
          ${managerComment ? `<p><strong>Manager Comment:</strong> ${managerComment}</p>` : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/employee/my-requests" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View My Requests
          </a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Leave status email sent to employee:', employeeEmail);
  } catch (error) {
    console.error('Error sending leave status email:', error);
    // Don't throw error - notification failure shouldn't block the request
  }
};

module.exports = {
  sendVerificationEmail,
  sendLeaveApplicationEmail,
  sendLeaveStatusEmail,
};
