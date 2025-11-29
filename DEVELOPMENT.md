# Development Guide - Employee Leave Management System

## 🛠️ Development Workflow

### Daily Development Routine

1. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```

### First Time Setup

1. **Install all dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

2. **Setup environment files**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your values
   
   # Frontend
   cd frontend
   cp .env.example .env
   ```

3. **Seed sample data** (Optional but recommended)
   ```bash
   cd backend
   npm run seed
   ```

## 📁 Project Architecture

### Backend Architecture (MVC Pattern)

```
backend/
├── models/           # Database schemas (Mongoose)
│   ├── User.js       # User model with auth methods
│   ├── LeaveRequest.js
│   └── Notification.js
│
├── controllers/      # Business logic
│   ├── authController.js
│   ├── leaveController.js
│   ├── dashboardController.js
│   └── notificationController.js
│
├── routes/          # API endpoints
│   ├── authRoutes.js
│   ├── leaveRoutes.js
│   ├── dashboardRoutes.js
│   └── notificationRoutes.js
│
├── middleware/      # Express middleware
│   ├── auth.js      # JWT verification & RBAC
│   └── validation.js # Request validation
│
├── utils/           # Helper functions
│   └── emailService.js
│
├── config/          # Configuration
│   └── database.js
│
└── server.js        # Entry point
```

### Frontend Architecture (Redux + React)

```
frontend/src/
├── components/      # Reusable components
│   ├── Layout.js
│   └── ProtectedRoute.js
│
├── pages/          # Page components
│   ├── Login.js
│   ├── Register.js
│   ├── VerifyEmail.js
│   ├── employee/
│   │   ├── Dashboard.js
│   │   ├── ApplyLeave.js
│   │   ├── MyRequests.js
│   │   └── Profile.js
│   └── manager/
│       ├── Dashboard.js
│       ├── PendingRequests.js
│       └── AllRequests.js
│
├── store/          # Redux state management
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── leaveSlice.js
│       ├── dashboardSlice.js
│       └── notificationSlice.js
│
├── utils/          # Utilities
│   └── axios.js    # API client configuration
│
├── App.js          # Main app with routing
└── index.js        # Entry point
```

## 🔄 Data Flow

### Employee Applies for Leave

```
1. User fills form → Apply Leave Page
2. Form submission → Redux action (applyLeave)
3. API call → POST /api/leaves
4. Backend validation → leaveController.applyLeave
5. Check leave balance → User model
6. Create leave request → LeaveRequest model
7. Send email to manager → emailService
8. Create notification → Notification model
9. Return response → Frontend
10. Update Redux store → Display success message
```

### Manager Approves Leave

```
1. Manager clicks approve → Pending Requests Page
2. Opens dialog → Enters comment
3. Redux action → approveLeaveRequest
4. API call → PUT /api/leaves/:id/approve
5. Validate manager role → auth middleware
6. Update leave status → LeaveRequest model
7. Deduct leave balance → User model
8. Send email to employee → emailService
9. Create notification → Notification model
10. Return response → Refresh pending list
```

## 🔐 Authentication Flow

### Registration Flow
```
1. User submits form → /api/auth/register
2. Validate input → Joi validation
3. Check if user exists → User.findOne()
4. Hash password → bcrypt
5. Generate verification token → crypto
6. Save user → User.create()
7. Send verification email → emailService
8. Return success response
```

### Login Flow
```
1. User submits credentials → /api/auth/login
2. Validate input → Joi validation
3. Find user → User.findOne()
4. Compare password → user.comparePassword()
5. Generate JWT → jwt.sign()
6. Return token + user data
7. Store in localStorage → Frontend
8. Redirect to dashboard
```

### Protected Route Flow
```
1. Request to protected route
2. Check Authorization header → auth middleware
3. Extract JWT token
4. Verify token → jwt.verify()
5. Get user from DB → User.findById()
6. Attach user to request → req.user
7. Check email verified → verifyEmail middleware
8. Check role → authorize middleware
9. Allow access to route
```

## 💾 Database Operations

### Common Queries

**Find all pending requests:**
```javascript
LeaveRequest.find({ status: 'pending' })
  .populate('userId', 'name email')
  .sort({ createdAt: -1 });
```

**Get user with leave balance:**
```javascript
User.findById(userId).select('+leaveBalance');
```

**Aggregate monthly leave data:**
```javascript
LeaveRequest.aggregate([
  {
    $match: {
      userId: mongoose.Types.ObjectId(userId),
      status: 'approved',
      startDate: { $gte: sixMonthsAgo }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: '$startDate' },
        month: { $month: '$startDate' }
      },
      totalDays: { $sum: '$totalDays' },
      count: { $sum: 1 }
    }
  }
]);
```

## 🎨 Styling Guidelines

### Tailwind CSS Classes
- Use utility classes for layout and spacing
- Prefix with `sm:`, `md:`, `lg:` for responsive design

### Material-UI Components
- Use MUI components for interactive elements
- Customize theme in `frontend/src/App.js`
- Use `sx` prop for inline styles

### Color Scheme
- Primary: `#4f46e5` (Indigo)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Receive verification email
- [ ] Verify email
- [ ] Login with credentials
- [ ] Access protected routes
- [ ] Logout

**Employee Features:**
- [ ] View dashboard with charts
- [ ] Apply for leave
- [ ] View leave requests
- [ ] Filter requests by status
- [ ] Cancel pending request
- [ ] Update profile
- [ ] Change password

**Manager Features:**
- [ ] View manager dashboard
- [ ] See pending requests
- [ ] Approve request with comment
- [ ] Reject request with comment
- [ ] Filter all requests
- [ ] View team statistics

### Testing with Sample Data

Run the seed script to populate database:
```bash
cd backend
npm run seed
```

This creates:
- 3 employee accounts
- 1 manager account
- Sample leave requests (pending, approved, rejected)

Login credentials:
- **Employee:** john@test.com / password123
- **Manager:** manager@test.com / password123

## 🚀 Adding New Features

### Adding a New Leave Type

1. **Update Backend Model** (`backend/models/LeaveRequest.js`):
   ```javascript
   leaveType: {
     type: String,
     enum: ['sick', 'casual', 'vacation', 'paternity', 'maternity'],
     required: true,
   }
   ```

2. **Update User Model** (`backend/models/User.js`):
   ```javascript
   leaveBalance: {
     sickLeave: { type: Number, default: 10 },
     casualLeave: { type: Number, default: 5 },
     vacation: { type: Number, default: 5 },
     paternityLeave: { type: Number, default: 15 },
     maternityLeave: { type: Number, default: 90 },
   }
   ```

3. **Update Frontend Forms** (`frontend/src/pages/employee/ApplyLeave.js`):
   ```javascript
   <MenuItem value="paternity">Paternity Leave</MenuItem>
   <MenuItem value="maternity">Maternity Leave</MenuItem>
   ```

### Adding File Upload for Leave Documents

1. **Install Multer** (backend):
   ```bash
   npm install multer
   ```

2. **Create Upload Middleware**:
   ```javascript
   const multer = require('multer');
   const storage = multer.diskStorage({
     destination: 'uploads/',
     filename: (req, file, cb) => {
       cb(null, Date.now() + '-' + file.originalname);
     }
   });
   const upload = multer({ storage });
   ```

3. **Update Leave Model**:
   ```javascript
   attachments: [{
     filename: String,
     path: String,
     uploadedAt: Date
   }]
   ```

4. **Update Route**:
   ```javascript
   router.post('/', protect, upload.array('documents', 3), applyLeave);
   ```

## 📊 Performance Optimization

### Backend Optimizations
- Use `.select()` to limit fields
- Use `.lean()` for read-only queries
- Add indexes to frequently queried fields
- Implement pagination for large datasets
- Use aggregation pipeline for complex queries

### Frontend Optimizations
- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Debounce search inputs
- Cache API responses
- Use production build for deployment

## 🐛 Debugging Tips

### Backend Debugging
```javascript
// Add detailed logging
console.log('User:', req.user);
console.log('Request Body:', req.body);
console.log('Query Params:', req.query);

// Use try-catch blocks
try {
  // Your code
} catch (error) {
  console.error('Error details:', error);
  console.error('Stack trace:', error.stack);
}
```

### Frontend Debugging
```javascript
// Redux DevTools
// Install: Redux DevTools Chrome extension

// Console logging
console.log('State:', store.getState());
console.log('Props:', props);
console.log('API Response:', response.data);

// Network tab
// Check request/response in browser DevTools
```

### Common Issues

**Issue: JWT token expired**
```javascript
// Solution: Clear localStorage
localStorage.clear();
// Or implement token refresh
```

**Issue: CORS error**
```javascript
// Solution: Update CORS in backend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**Issue: MongoDB connection timeout**
```bash
# Solution: Check MongoDB is running
ps aux | grep mongod
# Or check connection string
```

## 📦 Deployment

### Backend Deployment (Heroku Example)

1. Create `Procfile`:
   ```
   web: node server.js
   ```

2. Update `package.json`:
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel/Netlify)

1. Build:
   ```bash
   npm run build
   ```

2. Deploy build folder

3. Update environment variables on hosting platform

## 🔧 Useful Commands

```bash
# Backend
npm run dev          # Development with auto-reload
npm start            # Production mode
npm run seed         # Populate sample data

# Frontend
npm start            # Development server
npm run build        # Production build
npm test             # Run tests

# Database
mongosh              # MongoDB shell
db.users.find()      # List all users
db.users.updateOne({email: "user@test.com"}, {$set: {role: "manager"}})

# Git
git status           # Check status
git add .            # Stage changes
git commit -m "msg"  # Commit changes
git push             # Push to remote
```

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material-UI](https://mui.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request
5. Wait for review

Happy coding! 🚀
