# Quick Start Guide - Employee Leave Management System

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with these minimum required values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/els_db
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
DEFAULT_MANAGER_EMAIL=manager@test.com
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, just update MONGODB_URI in backend/.env
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
✅ Frontend running on http://localhost:3000

### 5. Create Your First Account

1. Open http://localhost:3000
2. Click on "Register" tab
3. Fill in your details:
   - Name: John Doe
   - Email: john@test.com
   - Password: password123
4. Click "Sign Up"
5. Check your email for verification link (or check backend console for the link)
6. Click verification link
7. Login with your credentials

### 6. Create a Manager Account (Optional)

To test manager features:

1. Register another account (e.g., manager@test.com)
2. Verify the email
3. Open MongoDB shell or Compass
4. Run this command to promote user to manager:

```javascript
db.users.updateOne(
  { email: "manager@test.com" },
  { $set: { role: "manager" } }
)
```

5. Login as manager to access manager dashboard

## 📋 Testing the Features

### As Employee:
1. ✅ Apply for leave → Navigate to "Apply Leave"
2. ✅ View requests → Navigate to "My Requests"
3. ✅ Check balance → View on Dashboard
4. ✅ Cancel pending request → Click delete icon on pending request
5. ✅ Update profile → Navigate to "Profile"

### As Manager:
1. ✅ View pending requests → Navigate to "Pending Requests"
2. ✅ Approve/Reject → Click action buttons and add comment
3. ✅ View all requests → Navigate to "All Requests"
4. ✅ View analytics → Check Manager Dashboard

## 🔧 Gmail App Password Setup

If you're using Gmail for email notifications:

1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. Security → App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Use it in `EMAIL_PASSWORD` in backend/.env

## 🐛 Common Issues & Solutions

### Issue: Can't connect to MongoDB
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod
```

### Issue: Email verification not working
**Solution:** 
- Check backend console for verification link
- Or update EMAIL_USER and EMAIL_PASSWORD in .env
- Verification link format: http://localhost:3000/verify-email?token=YOUR_TOKEN

### Issue: CORS errors
**Solution:** Make sure FRONTEND_URL in backend/.env matches your frontend URL

### Issue: Token expired
**Solution:** Clear browser localStorage and login again
```javascript
// In browser console:
localStorage.clear()
```

## 📦 Project Structure Summary

```
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   └── server.js     # Entry point
│
└── frontend/         # React Application
    ├── src/
    │   ├── pages/    # Page components
    │   ├── store/    # Redux store
    │   └── App.js    # Main component
    └── package.json
```

## 🎯 Next Steps

1. ✅ Customize the theme in `frontend/tailwind.config.js`
2. ✅ Add more leave types in backend models
3. ✅ Implement file upload for leave documents
4. ✅ Add calendar view for leave visualization
5. ✅ Implement leave request history export

## 📚 Useful Commands

```bash
# Backend
npm run dev          # Run with nodemon (auto-reload)
npm start            # Run production mode

# Frontend
npm start            # Development mode
npm run build        # Production build
npm test             # Run tests

# Database
mongo                # Open MongoDB shell
mongosh              # Open MongoDB shell (newer versions)
```

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in the README
- Check backend console for detailed error logs
- Use browser DevTools Network tab to debug API calls

## 🎉 Success Indicators

You know everything is working when:
- ✅ Backend shows "Server running" and "MongoDB Connected"
- ✅ Frontend opens without errors
- ✅ You can register and receive verification email
- ✅ Dashboard shows leave balance cards
- ✅ Charts render properly

Happy coding! 🚀
