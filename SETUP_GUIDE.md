# 📚 Complete Setup Guide

This guide provides detailed step-by-step instructions for setting up the Employee Leave Management System from scratch.

## Table of Contents
- [Prerequisites Installation](#prerequisites-installation)
- [Project Setup](#project-setup)
- [Database Configuration](#database-configuration)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Creating Test Data](#creating-test-data)
- [Verification Steps](#verification-steps)

---

## Prerequisites Installation

### 1. Install Node.js

**Windows:**
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Check "Automatically install necessary tools" option
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### 2. Install MongoDB

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run installer, choose "Complete" installation
3. Install MongoDB as a Windows Service
4. Install MongoDB Compass (GUI tool) when prompted
5. Verify installation:
   ```cmd
   mongo --version
   ```

**Start MongoDB Service (Windows):**
```cmd
# As Administrator
net start MongoDB
```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongo --version
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongod --version
```

### 3. Install Git (Optional but Recommended)

**Download:** https://git-scm.com/downloads

Verify:
```bash
git --version
```

---

## Project Setup

### Option A: Clone from Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/employee-leave-management.git
cd employee-leave-management
```

### Option B: Manual Setup

```bash
# Create project directory
mkdir employee-leave-management
cd employee-leave-management

# Create backend and frontend directories
mkdir backend frontend
```

---

## Database Configuration

### 1. Using Local MongoDB

**Verify MongoDB is Running:**

**Windows:**
```cmd
# Check service status
sc query MongoDB

# If not running, start it
net start MongoDB
```

**macOS/Linux:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# If not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

**Test Connection:**
```bash
# Connect to MongoDB shell
mongo

# Should see MongoDB shell prompt
# Type 'exit' to leave
```

### 2. Create Database

MongoDB will automatically create the database when you insert the first document, but you can verify:

```bash
mongo
use els_db
show dbs
exit
```

### 3. Using MongoDB Atlas (Cloud Alternative)

If you prefer cloud hosting:

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free tier
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (or allow from anywhere: 0.0.0.0/0)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/els_db
   ```

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Initialize npm (if starting from scratch)

```bash
npm init -y
```

### 3. Install Dependencies

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken nodemailer joi cors express-validator
```

**Install Dev Dependencies:**
```bash
npm install --save-dev nodemon
```

**Complete package.json dependencies:**
```json
{
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.9.3",
    "dotenv": "^16.4.7",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^7.0.11",
    "joi": "^17.13.3",
    "cors": "^2.8.5",
    "express-validator": "^7.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

### 4. Create .env File

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

**Edit `.env` with your configuration:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/els_db

# JWT Secret Keys (CHANGE THESE!)
JWT_SECRET=your_very_secure_secret_key_minimum_32_characters
JWT_EXPIRE=7d
EMAIL_VERIFICATION_SECRET=another_secure_secret_for_email_verification

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@els.com
```

### 5. Gmail App Password Setup

If using Gmail for email notifications:

1. Go to Google Account: https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" if not already enabled
4. Go back to Security page
5. Click "App passwords"
6. Select "Mail" and "Other" (name it "ELS App")
7. Click "Generate"
8. Copy the 16-character password
9. Use this in your `.env` file for `EMAIL_PASSWORD`

**Important:** This is NOT your regular Gmail password!

### 6. Verify File Structure

Ensure your backend directory has:
```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── leaveController.js
│   ├── dashboardController.js
│   └── notificationController.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── LeaveRequest.js
│   └── Notification.js
├── routes/
│   ├── authRoutes.js
│   ├── leaveRoutes.js
│   ├── dashboardRoutes.js
│   └── notificationRoutes.js
├── utils/
│   └── emailService.js
├── .env
├── .env.example
├── package.json
├── seed.js
└── server.js
```

### 7. Test Backend

```bash
npm run dev
```

**Expected output:**
```
[nodemon] starting `node server.js`
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**Test health endpoint:**
```bash
# Open browser or use curl
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

---

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2. Initialize React App (if starting from scratch)

```bash
npx create-react-app .
```

### 3. Install Dependencies

```bash
npm install @reduxjs/toolkit react-redux @mui/material @emotion/react @emotion/styled @mui/icons-material axios react-router-dom recharts date-fns
```

**Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Complete package.json dependencies:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@reduxjs/toolkit": "^2.5.0",
    "react-redux": "^9.2.0",
    "@mui/material": "^6.3.0",
    "@mui/icons-material": "^6.3.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "axios": "^1.7.9",
    "react-router-dom": "^7.1.1",
    "recharts": "^2.15.0",
    "date-fns": "^4.1.0",
    "tailwindcss": "^3.4.17"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### 4. Configure Tailwind CSS

**Edit `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Edit `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Create .env File

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

**Edit `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Verify File Structure

Ensure your frontend directory has:
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js
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
│   │   └── axios.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

### 7. Test Frontend

```bash
npm start
```

**Expected:**
- Browser opens automatically to http://localhost:3000
- Login/Register page appears
- No console errors

---

## Running the Application

### Running Both Servers Simultaneously

**Option 1: Two Terminal Windows**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**Option 2: Using concurrently (Optional)**

Install in project root:
```bash
npm install -g concurrently
```

Create `package.json` in project root:
```json
{
  "scripts": {
    "start": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}
```

Run:
```bash
npm start
```

**Option 3: Background Jobs (Windows PowerShell)**

```powershell
# Start backend
cd backend
Start-Job -ScriptBlock { Set-Location "path/to/backend"; npm run dev }

# Start frontend
cd ../frontend
npm start
```

---

## Creating Test Data

### 1. Run Seed Script

```bash
cd backend
npm run seed
```

or

```bash
node seed.js
```

**Expected Output:**
```
MongoDB Connected
Cleared existing data
Created users:
- john@test.com (Employee)
- jane@test.com (Employee)
- bob@test.com (Employee)
- manager@test.com (Manager)
All passwords: password123

Created sample leave requests
- 2 pending requests
- 2 approved requests
- 1 rejected request

✅ Database seeded successfully!

You can now login with:
Email: john@test.com or manager@test.com
Password: password123
```

### 2. Test Accounts Created

| Email | Password | Role | Email Verified |
|-------|----------|------|----------------|
| manager@test.com | password123 | Manager | ✅ Yes |
| john@test.com | password123 | Employee | ✅ Yes |
| jane@test.com | password123 | Employee | ✅ Yes |
| bob@test.com | password123 | Employee | ✅ Yes |

---

## Verification Steps

### 1. Verify MongoDB Connection

```bash
mongo
use els_db
show collections
# Should show: users, leaverequests, notifications
db.users.count()
# Should return 4
exit
```

### 2. Verify Backend API

**Test health endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Test login endpoint:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"password123"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "_id": "...",
      "name": "Manager Admin",
      "email": "manager@test.com",
      "role": "manager"
    }
  }
}
```

### 3. Verify Frontend

1. Open browser to http://localhost:3000
2. You should see the Login/Register page
3. Open browser DevTools (F12)
4. Check Console tab - should have no errors
5. Check Network tab - ensure API calls work

### 4. Test Complete Login Flow

1. Go to Login tab
2. Enter:
   - Email: `manager@test.com`
   - Password: `password123`
3. Click "Login"
4. Should redirect to `/manager/dashboard`
5. Dashboard should load with charts and statistics

### 5. Test Employee Features

1. Logout (click profile icon → Logout)
2. Login as employee:
   - Email: `john@test.com`
   - Password: `password123`
3. Navigate to "Apply Leave"
4. Fill form and submit
5. Check "My Requests" page
6. New request should appear

### 6. Test Manager Features

1. Logout
2. Login as manager: `manager@test.com`
3. Go to "Pending Requests"
4. Find John's request
5. Click Approve/Reject
6. Verify status updates

---

## Common Setup Issues

### Issue: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# Start if not running
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: npm install fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete lock file and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Email not sending

**Solution:**
- Verify Gmail App Password (not regular password)
- Check 2FA is enabled on Google Account
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check email credentials are correct

---

## Production Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variable
# In Vercel dashboard, add:
# REACT_APP_API_URL = https://your-backend-url.herokuapp.com/api
```

---

## Next Steps

After successful setup:

1. ✅ Customize branding (logo, colors, company name)
2. ✅ Configure email templates
3. ✅ Set up MongoDB Atlas for production
4. ✅ Implement additional leave types if needed
5. ✅ Add company holidays calendar
6. ✅ Set up automated backups
7. ✅ Configure monitoring (Sentry, LogRocket)
8. ✅ Write additional tests
9. ✅ Deploy to production

---

## Support

For issues or questions:
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [ARCHITECTURE.md](ARCHITECTURE.md)
- Check [API_TESTING.md](API_TESTING.md)

---

**Congratulations! Your Employee Leave Management System is now set up and running! 🎉**
