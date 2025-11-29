# 🏗️ Architecture Documentation

## System Architecture Overview

The Employee Leave Management System follows a modern **client-server architecture** with clear separation between frontend and backend.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React Application (Port 3000)           │   │
│  │                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │   Pages      │  │  Components  │  │   Redux   │ │   │
│  │  │  - Login     │  │  - Layout    │  │   Store   │ │   │
│  │  │  - Dashboard │  │  - Protected │  │  - Slices │ │   │
│  │  │  - Apply     │  │    Route     │  │  - Actions│ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │        Axios HTTP Client (API Layer)         │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                         SERVER SIDE                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Express.js API Server (Port 5000)            │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Routes  │→ │Controllers│→ │  Models  │          │   │
│  │  │  /auth   │  │  Auth     │  │  User    │          │   │
│  │  │  /leaves │  │  Leave    │  │  Leave   │          │   │
│  │  │  /dash   │  │  Dashboard│  │  Notify  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                   ↕                   │   │
│  │  ┌────────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │Middleware  │  │ Utilities│  │  Email   │        │   │
│  │  │- Auth      │  │- Validation│ │ Service  │        │   │
│  │  │- RBAC      │  │- Helpers │  │(Nodemailer)       │   │
│  │  └────────────┘  └──────────┘  └──────────┘        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         MongoDB Database (Port 27017)                │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │  Users   │  │LeaveRequests │  │Notifications │  │   │
│  │  │Collection│  │  Collection  │  │  Collection  │  │   │
│  │  └──────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **React 18.3.1** - Component-based UI library
- **Redux Toolkit 2.5.0** - Centralized state management
- **Material-UI 6.3.0** - Pre-built UI components
- **Tailwind CSS 3.4.17** - Utility-first styling
- **React Router 7.1.1** - Client-side routing
- **Axios 1.7.9** - HTTP client with interceptors

### Component Hierarchy

```
App (Router Provider)
│
├── Layout (Header, Navigation)
│   ├── ProtectedRoute (Auth Guard)
│   │   ├── Employee Routes
│   │   │   ├── Dashboard
│   │   │   ├── ApplyLeave
│   │   │   ├── MyRequests
│   │   │   └── Profile
│   │   │
│   │   └── Manager Routes
│   │       ├── Dashboard
│   │       ├── PendingRequests
│   │       └── AllRequests
│   │
│   └── Public Routes
│       ├── Login
│       ├── Register
│       └── VerifyEmail
```

### State Management (Redux)

**Store Structure:**
```javascript
{
  auth: {
    user: Object | null,
    token: String | null,
    isAuthenticated: Boolean,
    loading: Boolean,
    error: String | null
  },
  leave: {
    requests: Array,
    currentRequest: Object | null,
    loading: Boolean,
    error: String | null
  },
  dashboard: {
    stats: Object,
    charts: Object,
    loading: Boolean
  },
  notifications: {
    items: Array,
    unreadCount: Number
  }
}
```

**Redux Slices:**
1. **authSlice** - Authentication, user profile
2. **leaveSlice** - Leave requests management
3. **dashboardSlice** - Dashboard data and analytics
4. **notificationSlice** - Notifications management

### Routing Strategy

**Public Routes:**
- `/` → Login/Register page
- `/verify-email/:token` → Email verification

**Protected Routes (Employee):**
- `/employee/dashboard` → Employee dashboard
- `/employee/apply` → Apply for leave
- `/employee/requests` → View my requests
- `/employee/profile` → Update profile

**Protected Routes (Manager):**
- `/manager/dashboard` → Manager dashboard
- `/manager/pending` → Pending approvals
- `/manager/all-requests` → All team requests

**Route Protection:**
```javascript
<ProtectedRoute allowedRoles={['employee']}>
  <EmployeeDashboard />
</ProtectedRoute>
```

### API Integration

**Axios Configuration (`utils/axios.js`):**
```javascript
- Base URL: process.env.REACT_APP_API_URL
- Request Interceptor: Adds JWT token to headers
- Response Interceptor: Handles 401 (auto-logout)
- Error Handler: Formats error messages
```

**API Call Pattern:**
```javascript
// In Redux Slice
export const fetchLeaves = createAsyncThunk(
  'leave/fetchLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/leaves');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// In Component
const dispatch = useDispatch();
useEffect(() => {
  dispatch(fetchLeaves());
}, [dispatch]);
```

---

## Backend Architecture

### Technology Stack
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.21.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.9.3** - ODM for MongoDB
- **JWT** - Stateless authentication
- **Bcrypt.js** - Password hashing
- **Nodemailer 7.0.11** - Email service

### MVC Pattern

```
┌─────────────────────────────────────────────────┐
│                    REQUEST                       │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                 MIDDLEWARE                       │
│  - CORS                                         │
│  - Body Parser                                  │
│  - Auth Verification (JWT)                      │
│  - Role-Based Access Control                    │
│  - Request Validation                           │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                   ROUTES                         │
│  /api/auth      → authRoutes                    │
│  /api/leaves    → leaveRoutes                   │
│  /api/dashboard → dashboardRoutes               │
│  /api/notifications → notificationRoutes        │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                 CONTROLLERS                      │
│  - Receive request                              │
│  - Validate input (Joi)                         │
│  - Business logic                               │
│  - Call model methods                           │
│  - Format response                              │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                   MODELS                         │
│  - Define schema                                │
│  - Schema validation                            │
│  - Pre/Post hooks                               │
│  - Instance methods                             │
│  - Static methods                               │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                  DATABASE                        │
│  - MongoDB collections                          │
│  - CRUD operations                              │
│  - Transactions                                 │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                  RESPONSE                        │
│  {success, message, data}                       │
└─────────────────────────────────────────────────┘
```

### API Endpoints

#### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/verify-email` | Verify email token | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update profile | Private |

#### Leave Management (`/api/leaves`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Apply for leave | Employee |
| GET | `/my-requests` | Get my requests | Employee |
| GET | `/:id` | Get request by ID | Employee |
| DELETE | `/:id` | Cancel request | Employee |
| GET | `/pending` | Get pending requests | Manager |
| GET | `/all` | Get all requests | Manager |
| PUT | `/:id/approve` | Approve request | Manager |
| PUT | `/:id/reject` | Reject request | Manager |

#### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/employee` | Employee stats | Employee |
| GET | `/manager` | Manager stats | Manager |

#### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get notifications | Private |
| PUT | `/:id/read` | Mark as read | Private |
| PUT | `/read-all` | Mark all read | Private |

### Middleware Stack

**Order of Execution:**
```javascript
1. CORS → Allow cross-origin requests
2. Body Parser → Parse JSON/URL-encoded data
3. Custom Middleware:
   - auth.js → Verify JWT token
   - validation.js → Validate request body
4. Route Handler
5. Error Handler → Catch and format errors
```

**Authentication Middleware (`auth.js`):**
```javascript
- Extract token from Authorization header
- Verify token using JWT_SECRET
- Decode user ID from token
- Fetch user from database
- Attach user to req.user
- Continue to next middleware/controller
```

**Role-Based Access Control:**
```javascript
// Middleware to check user role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    next();
  };
};

// Usage
router.get('/pending', auth, requireRole('manager'), getPendingRequests);
```

---

## Database Architecture

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: String (enum: ['employee', 'manager']),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  leaveBalance: {
    sickLeave: Number,
    casualLeave: Number,
    vacation: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: Unique, for fast lookups
- `role`: For filtering by role
- `isEmailVerified`: For query optimization

#### 2. LeaveRequests Collection
```javascript
{
  _id: ObjectId,
  employee: ObjectId (ref: 'User', indexed),
  leaveType: String (enum: ['sick', 'casual', 'vacation']),
  startDate: Date (indexed),
  endDate: Date,
  isHalfDay: Boolean,
  totalDays: Number,
  reason: String,
  status: String (enum: ['pending', 'approved', 'rejected'], indexed),
  reviewedBy: ObjectId (ref: 'User'),
  reviewedAt: Date,
  managerComment: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `employee + status`: For employee dashboard
- `status`: For manager pending view
- `startDate`: For date range queries

**Compound Index:**
```javascript
leaveRequestSchema.index({ employee: 1, status: 1 });
```

#### 3. Notifications Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  type: String,
  message: String,
  relatedLeave: ObjectId (ref: 'LeaveRequest'),
  isRead: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Data Relationships

```
User (1) ─────── (Many) LeaveRequest
  │                         │
  │                         │
  └─────── (Many) Notification
           (as user)
              
Manager User ──reviews──→ LeaveRequest
                         (reviewedBy field)
```

### Data Flow Examples

**Apply for Leave:**
```
1. Employee submits leave form (Frontend)
2. POST /api/leaves (API call)
3. auth middleware → Verify token
4. leaveController.applyLeave → Validate data
5. Check leave balance
6. Create LeaveRequest document
7. Create Notification for manager
8. Send email to manager
9. Update user's leaveBalance (if approved)
10. Return response
```

**Approve Leave:**
```
1. Manager clicks Approve (Frontend)
2. PUT /api/leaves/:id/approve (API call)
3. auth + requireRole('manager') middleware
4. leaveController.approveRequest
5. Update LeaveRequest status
6. Update employee's leaveBalance
7. Create Notification for employee
8. Send approval email
9. Return updated request
```

---

## Security Architecture

### Authentication Flow

```
┌──────────────┐
│   Register   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Hash Password│ (Bcrypt)
└──────┬───────┘
       ↓
┌──────────────┐
│ Save to DB   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Send Email   │ (Verification Link)
└──────┬───────┘
       ↓
┌──────────────┐
│Verify Email  │
└──────┬───────┘
       ↓
┌──────────────┐
│    Login     │
└──────┬───────┘
       ↓
┌──────────────┐
│Compare Hash  │ (Bcrypt compare)
└──────┬───────┘
       ↓
┌──────────────┐
│Generate JWT  │ (Token with user ID)
└──────┬───────┘
       ↓
┌──────────────┐
│Return Token  │ (Frontend stores in localStorage)
└──────────────┘
```

### Security Measures

**1. Password Security:**
- Bcrypt hashing with salt rounds = 10
- Never store plain text passwords
- Password select: false (excluded from queries by default)

**2. JWT Token:**
```javascript
Structure: header.payload.signature
Payload: { id: userId, iat: timestamp, exp: expiration }
Expiry: 7 days (configurable)
Storage: localStorage (frontend)
Transmission: Authorization: Bearer <token>
```

**3. Email Verification:**
- Crypto-random token generation
- Token expires in 24 hours
- One-time use tokens

**4. CORS Configuration:**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**5. Input Validation:**
- Joi schemas for request validation
- Express-validator for additional checks
- Mongoose schema validation

**6. Role-Based Authorization:**
- Middleware checks user role
- Endpoints protected by role
- No privilege escalation possible

---

## Performance Optimization

### Backend Optimizations

**1. Database Indexing:**
```javascript
// Frequently queried fields
userSchema.index({ email: 1 });
leaveRequestSchema.index({ employee: 1, status: 1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });
```

**2. Query Optimization:**
```javascript
// Use projection to limit fields
User.findById(id).select('name email role');

// Use lean() for read-only queries
LeaveRequest.find().lean().exec();

// Pagination
LeaveRequest.find()
  .limit(pageSize)
  .skip((page - 1) * pageSize);
```

**3. Caching Strategy:**
- Dashboard stats cached for 5 minutes
- User profile cached in Redux
- Token stored in localStorage

### Frontend Optimizations

**1. Code Splitting:**
```javascript
// Lazy load routes
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'));
```

**2. Memoization:**
```javascript
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
```

**3. Redux Optimization:**
- Normalized state shape
- Selective subscriptions with useSelector
- Batch actions when possible

---

## Deployment Architecture

### Production Setup

```
┌──────────────────────────────────────┐
│         Load Balancer / CDN          │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│        Frontend (Static Host)         │
│  - Vercel / Netlify / AWS S3         │
│  - Built React app                   │
└──────────────┬───────────────────────┘
               ↓ API Calls
┌──────────────────────────────────────┐
│       Backend (Node.js Server)       │
│  - Heroku / Railway / AWS EC2        │
│  - PM2 Process Manager               │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│      Database (MongoDB Atlas)         │
│  - Managed MongoDB cluster           │
│  - Automatic backups                 │
└──────────────────────────────────────┘
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
EMAIL_USER=<email>
EMAIL_PASSWORD=<app-password>
FRONTEND_URL=https://yourdomain.com
```

**Frontend (.env.production):**
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## Testing Strategy

### Backend Testing
- Unit tests: Controller logic
- Integration tests: API endpoints
- Database tests: Model validation

### Frontend Testing
- Component tests: React Testing Library
- Integration tests: User flows
- E2E tests: Cypress

---

## Monitoring & Logging

### Backend Logging
```javascript
// Winston logger
logger.info('User logged in', { userId, timestamp });
logger.error('Database error', { error, stack });
```

### Error Tracking
- Sentry for production errors
- Console logs for development
- MongoDB query logs

---

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT)
- Load balancer distribution
- Multiple Node.js instances

### Database Scaling
- MongoDB sharding for large datasets
- Read replicas for heavy reads
- Indexes for query performance

### Caching Layer
- Redis for session/token management
- Cache frequently accessed data
- Reduce database load

---

This architecture provides a solid foundation for a production-ready application with room for growth and optimization.
