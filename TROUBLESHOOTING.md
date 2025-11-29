# 🔧 Troubleshooting Guide

This guide helps you resolve common issues when running the Employee Leave Management System.

## Table of Contents
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [Common Error Messages](#common-error-messages)

---

## Backend Issues

### 1. Backend Server Won't Start

**Problem:** Server starts but immediately stops or won't start at all.

**Solution:**
```bash
# Step 1: Check if port 5000 is already in use
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Step 2: Kill the process using the port
# Windows (use PID from previous command)
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>

# Step 3: Restart backend
cd backend
npm run dev
```

### 2. MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# Start MongoDB if not running
net start MongoDB

# macOS
brew services list
brew services start mongodb-community

# Linux
sudo systemctl status mongod
sudo systemctl start mongod
```

### 3. "Invalid Credentials" on Login

**Problem:** Correct credentials showing "Invalid credentials"

**Root Cause:** Users not seeded properly or password hashing issue

**Solution:**
```bash
cd backend

# Re-run the seed script
node seed.js

# This creates:
# - manager@test.com / password123
# - john@test.com / password123
# - jane@test.com / password123
# - bob@test.com / password123
```

**Verify in MongoDB:**
```bash
# Connect to MongoDB
mongo

# Use the database
use els_db

# Check users exist with proper password hash
db.users.find({}, {email: 1, password: 1, isEmailVerified: 1})

# Password should be a bcrypt hash (60 characters starting with $2a)
```

### 4. Email Service Errors

**Error:** Email notifications not sending

**Solution:**

1. **For Gmail users:**
   ```env
   # In backend/.env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password  # Not regular password!
   ```

2. **Generate App Password:**
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use that password in .env

3. **For other email providers:**
   ```env
   EMAIL_SERVICE=outlook  # or other
   EMAIL_HOST=smtp-mail.outlook.com
   EMAIL_PORT=587
   ```

---

## Frontend Issues

### 1. "Failed to Compile" Errors

**Error:** Module not found or compilation errors

**Solution:**
```bash
cd frontend

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm start
```

### 2. Frontend Running on Different Port

**Problem:** Frontend starts on port 3001 instead of 3000

**Cause:** Port 3000 already in use

**Solutions:**

**Option A - Use port 3001:**
- Simply use http://localhost:3001

**Option B - Free port 3000:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Restart frontend
npm start
```

**Option C - Specify port:**
```bash
# Windows
set PORT=3002 && npm start

# macOS/Linux
PORT=3002 npm start
```

### 3. API Connection Errors

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Checklist:**
1. ✅ Backend is running on port 5000
2. ✅ Frontend .env has correct API URL
3. ✅ No firewall blocking requests

**Verify:**
```bash
# Test backend health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

**Fix frontend .env:**
```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Material-UI Icon Errors

**Error:** `export 'SomeIcon' was not found`

**Solution:** Material-UI v6 changed icon names

Common changes:
- `TodayIcon` → `Today`
- `EventIcon` → `Event`
- `PersonIcon` → `Person`

**Fix:**
```javascript
// Before (v5)
import { TodayIcon } from '@mui/icons-material';

// After (v6)
import { Today as TodayIcon } from '@mui/icons-material';
```

### 5. Redux State Not Persisting

**Problem:** User gets logged out on page refresh

**Solution:**
```javascript
// Check localStorage in browser console
localStorage.getItem('token')
localStorage.getItem('user')

// Should have values. If not, login again.
```

---

## Database Issues

### 1. Database Not Found

**Error:** `MongoServerError: database does not exist`

**Solution:**
```bash
# MongoDB auto-creates database on first insert
# Just run the seed script
cd backend
node seed.js
```

### 2. Duplicate Key Error

**Error:** `E11000 duplicate key error`

**Cause:** Trying to create user with existing email

**Solution:**
```bash
# Clear database and reseed
mongo
use els_db
db.users.deleteMany({})
db.leaverequests.deleteMany({})
db.notifications.deleteMany({})
exit

# Run seed script
node seed.js
```

### 3. Connection String Issues

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/els_db?retryWrites=true&w=majority
```

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/els_db
```

---

## Authentication Issues

### 1. JWT Token Expired

**Error:** `Token expired` or `Invalid token`

**Solution:**
```javascript
// Clear localStorage and login again
localStorage.clear()
// Refresh page and login
```

### 2. Email Not Verified

**Problem:** Can't login even with correct credentials

**Cause:** Email verification required but not completed

**Solution:**
```bash
# Bypass for testing - manually verify user in database
mongo
use els_db
db.users.updateOne(
  {email: "user@test.com"}, 
  {$set: {isEmailVerified: true}}
)
```

Or use seeded test accounts which are pre-verified.

---

## Common Error Messages

### "Cannot read property of undefined"

**Cause:** Redux state not initialized properly

**Solution:**
```bash
# Clear browser cache and localStorage
# In browser console:
localStorage.clear()
sessionStorage.clear()
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### "CORS Policy Error"

**Error:** `blocked by CORS policy`

**Solution:**

**Backend server.js should have:**
```javascript
const cors = require('cors');
app.use(cors());
```

**For specific origin:**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### "Module Not Found" Errors

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Performance Issues

### Slow API Response

**Solutions:**
1. **Add indexes to MongoDB:**
   ```javascript
   // In models/User.js
   userSchema.index({ email: 1 });
   
   // In models/LeaveRequest.js
   leaveRequestSchema.index({ employee: 1, status: 1 });
   ```

2. **Use pagination:**
   ```javascript
   // Already implemented in API
   GET /api/leaves?page=1&limit=10
   ```

### High Memory Usage

**Solution:**
```bash
# Increase Node.js memory limit
# Windows
set NODE_OPTIONS=--max-old-space-size=4096 && npm start

# macOS/Linux
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

---

## Development Tools

### View Application Logs

**Backend logs:**
```bash
cd backend
npm run dev
# Logs appear in terminal
```

**Frontend logs:**
- Open browser DevTools (F12)
- Go to Console tab

### Database Inspection

**MongoDB Compass (GUI):**
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- Browse `els_db` database

**MongoDB Shell:**
```bash
mongo
use els_db
db.users.find().pretty()
db.leaverequests.find().pretty()
```

---

## Getting Help

If you're still experiencing issues:

1. **Check logs:** Look for error messages in terminal/console
2. **Verify setup:** Ensure all prerequisites are installed
3. **Review config:** Double-check .env files
4. **Test components:** Test backend and frontend separately
5. **Fresh start:** Delete node_modules and reinstall

### Debug Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000/3001
- [ ] .env files are configured correctly
- [ ] Database is seeded with test data
- [ ] No port conflicts
- [ ] No firewall blocking connections

---

## Quick Reset (Nuclear Option)

If everything is broken:

```bash
# Stop all servers (Ctrl+C in all terminals)

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
node seed.js
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start

# MongoDB
# Restart MongoDB service
```

This will give you a completely fresh installation.
