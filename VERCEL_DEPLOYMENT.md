# Vercel Deployment Guide

This guide will walk you through deploying both the backend and frontend of the Employee Leave Management System to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed globally: `npm install -g vercel`
3. GitHub repository with your code
4. MongoDB Atlas database (already configured)

## Project Structure

```
TAP project test/
├── backend/               # Backend API (Node.js/Express)
│   ├── api/
│   │   └── index.js      # Vercel serverless entry point
│   ├── vercel.json       # Backend Vercel config
│   └── ...
├── frontend/             # Frontend React app
│   ├── vercel.json       # Frontend Vercel config
│   └── ...
└── vercel.json           # Root Vercel config (optional)
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Deploy Backend

1. **Login to Vercel Dashboard**: Go to https://vercel.com/dashboard

2. **Create New Project**:
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository: `harish00506/TAP-Project-test`

3. **Configure Backend Project**:
   ```
   Project Name: tap-els-backend
   Framework Preset: Other
   Root Directory: backend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: npm install
   ```

4. **Add Environment Variables**:
   Click "Environment Variables" and add these:

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://mongodbproject:7892855850@cluster0.kdbqgi6.mongodb.net/els_db
   JWT_SECRET=9b234e95da65ddf51e39a9c8e2c65afb8c3ff9e391b2038ec150a636de172e79
   JWT_EXPIRE=7d
   EMAIL_VERIFICATION_SECRET=9fbf4121b2ac14be2b1b7307a084fe86a926be33f0bda4bf62064cc6fb4da742
   EMAIL_SERVICE=gmail
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=har817727@gmail.com
   EMAIL_PASSWORD=[Your 16-char Gmail App Password]
   EMAIL_FROM=har817727@gmail.com
   FRONTEND_URL=[Will add after frontend deploys]
   DEFAULT_MANAGER_EMAIL=har817727@gmail.com
   ```

5. **Deploy**: Click "Deploy"

6. **Get Backend URL**: After deployment, copy your backend URL (e.g., `https://tap-els-backend.vercel.app`)

#### Step 2: Deploy Frontend

1. **Create Another New Project**:
   - Click "Add New..." → "Project"
   - Select the same GitHub repository: `harish00506/TAP-Project-test`

2. **Configure Frontend Project**:
   ```
   Project Name: tap-els-frontend
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Add Environment Variable**:
   ```
   REACT_APP_API_URL=https://tap-els-backend.vercel.app/api
   ```
   (Replace with your actual backend URL from Step 1.6)

4. **Deploy**: Click "Deploy"

5. **Get Frontend URL**: Copy your frontend URL (e.g., `https://tap-els-frontend.vercel.app`)

#### Step 3: Update Backend with Frontend URL

1. Go back to your backend project in Vercel
2. Click "Settings" → "Environment Variables"
3. Edit `FRONTEND_URL` and set it to your frontend URL
4. Click "Save"
5. Go to "Deployments" tab
6. Click "..." on the latest deployment → "Redeploy"

#### Step 4: Seed Production Database

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Link to backend project: `cd backend && vercel link`
4. Run seed command: `vercel exec npm run seed`

   OR manually via Vercel dashboard:
   - Go to backend project → "Storage" tab
   - Connect to your MongoDB Atlas directly and import test data

### Option 2: Deploy via Vercel CLI

#### Backend Deployment

```bash
# Navigate to backend
cd backend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? tap-els-backend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod

# Add environment variables
vercel env add NODE_ENV
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRE
vercel env add EMAIL_VERIFICATION_SECRET
vercel env add EMAIL_SERVICE
vercel env add EMAIL_HOST
vercel env add EMAIL_PORT
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD
vercel env add EMAIL_FROM
vercel env add FRONTEND_URL
vercel env add DEFAULT_MANAGER_EMAIL

# Redeploy with env vars
vercel --prod
```

#### Frontend Deployment

```bash
# Navigate to frontend
cd ../frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? tap-els-frontend
# - Directory? ./
# - Override settings? No

# Add environment variable
vercel env add REACT_APP_API_URL

# Deploy to production
vercel --prod
```

## Post-Deployment Configuration

### 1. Update Environment Variables

**Backend** (`FRONTEND_URL`):
```bash
cd backend
vercel env add FRONTEND_URL production
# Enter: https://tap-els-frontend.vercel.app
vercel --prod
```

**Frontend** (`REACT_APP_API_URL`):
```bash
cd frontend
vercel env add REACT_APP_API_URL production
# Enter: https://tap-els-backend.vercel.app/api
vercel --prod
```

### 2. Test the Deployment

1. Visit your frontend URL: `https://tap-els-frontend.vercel.app`
2. Try logging in with test credentials:
   - Email: `manager@test.com`
   - Password: `password123`

### 3. Seed Production Database

If you need to add test data to production:

```bash
cd backend
vercel exec npm run seed
```

Or manually:
1. Connect to MongoDB Atlas
2. Use MongoDB Compass or Atlas UI
3. Import the seed data

## Important Notes

### Gmail App Password
⚠️ **Critical**: You must use a Gmail App Password, not your regular password!

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with `har817727@gmail.com`
3. Create new app password:
   - Select "Mail"
   - Select "Other" (custom name)
   - Name it "Employee Leave System"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
5. Use this in `EMAIL_PASSWORD` environment variable

### Environment Variables Security
- Never commit `.env` files to GitHub
- Always use Vercel dashboard or CLI to add environment variables
- Environment variables are encrypted by Vercel

### MongoDB Atlas
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Vercel's IP addresses to whitelist
- Database URI is already configured

### Custom Domain (Optional)
To add a custom domain:
1. Go to project → "Settings" → "Domains"
2. Add your domain
3. Configure DNS records as shown
4. Update `FRONTEND_URL` and `REACT_APP_API_URL` accordingly

## Deployment URLs Structure

After deployment, your URLs will be:

**Backend API**:
- `https://tap-els-backend.vercel.app/api/auth/login`
- `https://tap-els-backend.vercel.app/api/leaves`
- `https://tap-els-backend.vercel.app/api/dashboard`
- `https://tap-els-backend.vercel.app/api/notifications`
- `https://tap-els-backend.vercel.app/api/health`

**Frontend**:
- `https://tap-els-frontend.vercel.app`

## Continuous Deployment

Once configured, every push to your GitHub repository will automatically trigger a new deployment:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

You can configure this in Vercel project settings.

## Troubleshooting

### Backend Issues

**Issue**: API routes return 404
- **Solution**: Ensure `backend/api/index.js` exists and `vercel.json` is configured correctly

**Issue**: Database connection fails
- **Solution**: Check MongoDB Atlas allows Vercel IPs (0.0.0.0/0) and `MONGODB_URI` is correct

**Issue**: Email not sending
- **Solution**: Use Gmail App Password (16 chars), not regular password

### Frontend Issues

**Issue**: API calls fail with CORS error
- **Solution**: Ensure backend has correct CORS configuration and is deployed

**Issue**: Environment variable not working
- **Solution**: Environment variables must start with `REACT_APP_` and require rebuild

**Issue**: 404 on page refresh
- **Solution**: `vercel.json` should have rewrite rule to `/index.html`

### General Issues

**Issue**: Deployment fails
- **Solution**: Check Vercel build logs for specific errors

**Issue**: Slow cold starts
- **Solution**: Vercel serverless functions have cold starts, consider upgrading plan

## Monitoring

### View Logs
```bash
# Backend logs
cd backend
vercel logs

# Frontend logs
cd frontend
vercel logs
```

### Vercel Dashboard
- Monitor deployments, analytics, and logs at https://vercel.com/dashboard

## Updating Your Application

### Method 1: Git Push (Automatic)
```bash
git add .
git commit -m "Update application"
git push origin main
```
Vercel will automatically deploy changes.

### Method 2: Manual Redeploy
```bash
cd backend  # or frontend
vercel --prod
```

## Cost Considerations

**Vercel Free Tier** includes:
- 100GB bandwidth per month
- Unlimited serverless function executions (with time limits)
- Automatic SSL certificates
- Preview deployments
- Basic analytics

For production use with higher traffic, consider upgrading to Pro plan.

## Support

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Project Issues: Check `TROUBLESHOOTING.md`

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (development)
vercel

# Deploy (production)
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Link local project
vercel link

# Pull environment variables
vercel env pull

# Execute command in Vercel environment
vercel exec [command]
```

---

**Deployment Checklist:**

- [ ] MongoDB Atlas allows Vercel IPs (0.0.0.0/0)
- [ ] Gmail App Password generated (16 characters)
- [ ] Backend deployed with all environment variables
- [ ] Backend URL copied
- [ ] Frontend deployed with `REACT_APP_API_URL`
- [ ] Backend updated with `FRONTEND_URL`
- [ ] Both services redeployed
- [ ] Database seeded with test data
- [ ] Tested login functionality
- [ ] Tested leave request creation
- [ ] Tested manager approval workflow
- [ ] Tested email notifications
- [ ] Verified dashboard displays correctly

**You're all set! 🚀**
