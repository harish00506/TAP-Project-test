# Vercel Deployment - Quick Start

## 🚀 Deploy in 5 Minutes

### Step 1: Deploy Backend

1. Go to https://vercel.com/new
2. Import your GitHub repo: `harish00506/TAP-Project-test`
3. Configure:
   - **Root Directory**: `backend`
   - **Framework**: Other
4. Add Environment Variables (click "Environment Variables"):
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
   EMAIL_PASSWORD=Password@1234
   EMAIL_FROM=har817727@gmail.com
   FRONTEND_URL=http://localhost:3000
   DEFAULT_MANAGER_EMAIL=har817727@gmail.com
   ```
5. Click **Deploy**
6. **Copy your backend URL** (e.g., `https://tap-els-backend.vercel.app`)

### Step 2: Deploy Frontend

1. Go to https://vercel.com/new again
2. Import same repo: `harish00506/TAP-Project-test`
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://[YOUR-BACKEND-URL].vercel.app/api
   ```
   (Use the URL from Step 1.6)
5. Click **Deploy**
6. **Copy your frontend URL** (e.g., `https://tap-els-frontend.vercel.app`)

### Step 3: Update Backend

1. Go back to your backend project in Vercel
2. Settings → Environment Variables
3. Edit `FRONTEND_URL` → Paste your frontend URL from Step 2.6
4. Save
5. Deployments tab → Click "..." → Redeploy

### Step 4: Test

Visit your frontend URL and login:
- Email: `manager@test.com`
- Password: `password123`

---

## ⚠️ Important

**Gmail App Password**: Replace `EMAIL_PASSWORD` with a 16-character app password from https://myaccount.google.com/apppasswords

---

## 📝 Your URLs

Fill in after deployment:
- Backend: `https://_____________________.vercel.app`
- Frontend: `https://_____________________.vercel.app`

---

**Full guide**: See `VERCEL_DEPLOYMENT.md` for detailed instructions and troubleshooting.
