# Employee Leave Management System (ELS)

A comprehensive full-stack web application for managing employee leave requests with role-based access control, built with modern technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Employee Leave Management System is a modern web application that streamlines the process of applying for, tracking, and managing employee leaves. The system supports two roles (Employee and Manager) with distinct permissions and provides real-time notifications, analytics dashboards, and comprehensive leave tracking capabilities.

## 🔧 Tech Stack

### Frontend
- **React** 18.2 - UI library with functional components and hooks
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - Component library for modern UI
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization and charts
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **date-fns** - Date formatting and manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Nodemailer** - Email notifications
- **Joi** - Request validation

## ✨ Features

### Authentication & Authorization
- ✅ User registration with email verification
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Secure password hashing
- ✅ Protected routes

### Employee Features
- ✅ Apply for leave (Sick, Casual, Vacation)
- ✅ View leave balance by type
- ✅ Track leave request status
- ✅ Cancel pending requests
- ✅ View personal dashboard with stats
- ✅ Update profile information
- ✅ Support for half-day leaves

### Manager Features
- ✅ View all pending leave requests
- ✅ Approve/reject requests with comments
- ✅ View all employees' leave history
- ✅ Team-level analytics dashboard
- ✅ Filter and search capabilities
- ✅ Email notifications for new requests

### Dashboard & Analytics
- ✅ Interactive charts (Bar, Pie)
- ✅ Leave distribution by type
- ✅ Monthly leave trends
- ✅ Real-time statistics
- ✅ Upcoming leave calendar

### Notifications
- ✅ Email notifications
- ✅ In-app notification system
- ✅ Notification for leave status updates

## 📁 Project Structure

```
TAP project test/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── leaveController.js   # Leave management
│   │   ├── dashboardController.js
│   │   └── notificationController.js
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── LeaveRequest.js      # Leave request schema
│   │   └── Notification.js      # Notification schema
│   ├── middleware/
│   │   ├── auth.js              # JWT & RBAC middleware
│   │   └── validation.js        # Request validation
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/
│   │   └── emailService.js      # Email functionality
│   ├── .env.example             # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js        # Main layout component
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── VerifyEmail.js
    │   │   ├── employee/
    │   │   │   ├── Dashboard.js
    │   │   │   ├── ApplyLeave.js
    │   │   │   ├── MyRequests.js
    │   │   │   └── Profile.js
    │   │   └── manager/
    │   │       ├── Dashboard.js
    │   │       ├── PendingRequests.js
    │   │       └── AllRequests.js
    │   ├── store/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── leaveSlice.js
    │   │       ├── dashboardSlice.js
    │   │       └── notificationSlice.js
    │   ├── utils/
    │   │   └── axios.js          # Axios configuration
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration (see [Environment Variables](#environment-variables))

5. Start MongoDB (if running locally):
```bash
mongod
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/els_db
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/els_db

# JWT Secret Keys
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_VERIFICATION_SECRET=your_email_verification_secret_key

# Email Configuration (using Gmail)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@els.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Default Manager Email
DEFAULT_MANAGER_EMAIL=manager@company.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm start
```
App will run on http://localhost:3000

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with your preferred web server
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/verify-email` | Verify email address | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Leave Management Endpoints

#### Employee
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/leaves` | Apply for leave | Employee |
| GET | `/api/leaves/my-requests` | Get my requests | Employee |
| DELETE | `/api/leaves/:id` | Cancel leave request | Employee |
| GET | `/api/leaves/balance` | Get leave balance | Employee |

#### Manager
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leaves/all` | Get all requests | Manager |
| GET | `/api/leaves/pending` | Get pending requests | Manager |
| PUT | `/api/leaves/:id/approve` | Approve request | Manager |
| PUT | `/api/leaves/:id/reject` | Reject request | Manager |

### Dashboard Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/employee` | Employee stats | Employee |
| GET | `/api/dashboard/manager` | Manager stats | Manager |

### Notification Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notifications` | Get notifications | Private |
| PUT | `/api/notifications/:id/read` | Mark as read | Private |
| PUT | `/api/notifications/mark-all-read` | Mark all as read | Private |

## 👥 User Roles

### Employee
- Register and login
- Email verification required
- Apply for leave (Sick, Casual, Vacation)
- View own leave requests
- View leave balance (Sick: 10 days, Casual: 5 days, Vacation: 5 days)
- Cancel pending requests only
- View personal dashboard with analytics
- Update profile

### Manager
- Same authentication as employees
- Role upgraded via database
- View all pending requests
- Approve/reject requests with comments
- View all employees' leave history
- Team-level analytics dashboard
- Receive email notifications for new requests

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)
*Tabbed interface for login and registration*

### Employee Dashboard
![Employee Dashboard](./screenshots/employee-dashboard.png)
*Overview of leave balance, statistics, and charts*

### Apply Leave
![Apply Leave](./screenshots/apply-leave.png)
*Form to submit new leave requests*

### My Requests
![My Requests](./screenshots/my-requests.png)
*Table view of all leave requests with filtering*

### Manager Dashboard
![Manager Dashboard](./screenshots/manager-dashboard.png)
*Team-level analytics and statistics*

### Pending Requests (Manager)
![Pending Requests](./screenshots/pending-requests.png)
*Manager view for approving/rejecting requests*

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee | manager),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  leaveBalance: {
    sickLeave: Number (default: 10),
    casualLeave: Number (default: 5),
    vacation: Number (default: 5)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### LeaveRequests Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  leaveType: String (sick | casual | vacation),
  startDate: Date,
  endDate: Date,
  totalDays: Number (supports 0.5 for half-day),
  reason: String,
  status: String (pending | approved | rejected),
  managerComment: String,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String,
  message: String,
  leaveRequestId: ObjectId (ref: LeaveRequest),
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Key Features & Business Rules

### Leave Management Rules
- **Leave Types:** Sick, Casual, Vacation
- **Default Balances:** Sick (10 days), Casual (5 days), Vacation (5 days)
- **Half-day Support:** Employees can apply for 0.5 day leaves
- **Same-day Leave:** Allowed
- **Future-dated Leaves:** Allowed
- **Overlapping Requests:** Allowed
- **Cancellation:** Only pending requests can be cancelled
- **Modification:** Approved/rejected requests cannot be modified

### Email Notifications
- Registration confirmation with verification link
- Leave application notification to managers
- Leave approval/rejection notification to employees

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Email verification required
- Protected API routes
- HTTP-only cookies support (optional)

## 🛠️ Development

### Adding a New Manager
Managers are created by promoting existing employees. Use MongoDB shell or a database GUI:

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "manager" } }
)
```

### Email Configuration for Gmail
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASSWORD` environment variable

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@els.com or open an issue in the repository.

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- Recharts for data visualization
- The open-source community

---

**Note:** Remember to update all placeholder values in `.env` files before running in production!

Made with ❤️ by Your Development Team
